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
};

type RotateRightInstructionConfig = RegisterMode | MemoryMode;

export class RotateRightInstruction implements Instruction {
  constructor(private config: RotateRightInstructionConfig) {}

  execute(cpu: CPU) {
    const carryIn = cpu.status.is(Flag.CARRY) ? 1 : 0;

    if (this.config.mode === "REGISTER") {
      const value = cpu.registers[this.config.register];

      const carryOut = (value & 0x01) !== 0;
      const result = ((value >> 1) | (carryIn << 7)) & 0xff;

      cpu.registers[this.config.register] = result;

      cpu.status.setFlag(Flag.CARRY, carryOut);
      cpu.status.updateZeroAndNegative(result);

      return;
    }

    // MEMORY
    const addr = this.config.getAddress(cpu);
    const value = cpu.memory.read(addr);

    // Read-Modify-Write
    cpu.memory.write(addr, value);

    const carryOut = (value & 0x01) !== 0;
    const result = ((value >> 1) | (carryIn << 7)) & 0xff;

    cpu.memory.write(addr, result);

    cpu.status.setFlag(Flag.CARRY, carryOut);
    cpu.status.updateZeroAndNegative(result);
  }
}
