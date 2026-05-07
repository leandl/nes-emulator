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

type LogicalShiftRightInstructionConfig = RegisterMode | MemoryMode;

export class LogicalShiftRightInstruction implements Instruction {
  constructor(private config: LogicalShiftRightInstructionConfig) {}

  execute(cpu: CPU) {
    if (this.config.mode === "REGISTER") {
      const value = cpu.registers[this.config.register];

      const carry = (value & 0x01) !== 0;
      const result = (value >> 1) & 0xff;

      cpu.registers[this.config.register] = result;

      cpu.registers.STATUS.setFlag(Flag.CARRY, carry);
      cpu.registers.STATUS.setFlag(Flag.NEGATIVE, false); //
      cpu.registers.STATUS.setFlag(Flag.ZERO, result === 0);

      return 2; // cycles
    }

    // MEMORY
    const { address } = this.config.getAddress(cpu);
    const value = cpu.read(address);

    // Read-Modify-Write
    cpu.write(address, value);

    const carry = (value & 0x01) !== 0;
    const result = (value >> 1) & 0xff;

    cpu.write(address, result);

    cpu.registers.STATUS.setFlag(Flag.CARRY, carry);
    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, false);
    cpu.registers.STATUS.setFlag(Flag.ZERO, result === 0);

    return this.config.baseCycles;
  }
}
