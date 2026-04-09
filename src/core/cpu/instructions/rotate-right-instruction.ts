import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type RegisterMode = {
  mode: "REGISTER";
  register: CPURegister.ACCUMULATOR;
};

type MemoryMode = {
  mode: "MEMORY";
  getAddress: AddressResolver;
  baseCycles: number;
};

type RotateRightInstructionConfig = RegisterMode | MemoryMode;

export class RotateRightInstruction implements Instruction {
  constructor(private config: RotateRightInstructionConfig) {}

  execute(cpu: CPU) {
    const carryIn = cpu.registers.STATUS.is(Flag.CARRY) ? 1 : 0;

    if (this.config.mode === "REGISTER") {
      const value = cpu.registers[this.config.register];

      const carryOut = (value & 0x01) !== 0;
      const result = ((value >> 1) | (carryIn << 7)) & 0xff;

      cpu.registers[this.config.register] = result;

      cpu.registers.STATUS.setFlag(Flag.CARRY, carryOut);
      cpu.registers.STATUS.updateZeroAndNegative(result);

      return 2; // cycles
    }

    // MEMORY
    const { address } = this.config.getAddress(cpu);
    const value = cpu.memory.read(address);

    // Read-Modify-Write
    cpu.memory.write(address, value);

    const carryOut = (value & 0x01) !== 0;
    const result = ((value >> 1) | (carryIn << 7)) & 0xff;

    cpu.memory.write(address, result);

    cpu.registers.STATUS.setFlag(Flag.CARRY, carryOut);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
