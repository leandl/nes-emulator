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

type LogicalShiftRightInstructionConfig = RegisterMode | MemoryMode;

export class LogicalShiftRightInstruction implements Instruction {
  constructor(private config: LogicalShiftRightInstructionConfig) {}

  execute(cpu: CPU) {
    if (this.config.mode === "REGISTER") {
      const value = cpu.registers[this.config.register];

      const carry = (value & 0x01) !== 0;
      const result = (value >> 1) & 0xff;

      cpu.registers[this.config.register] = result;

      cpu.status.setFlag(Flag.CARRY, carry);
      cpu.status.setFlag(Flag.NEGATIVE, false); //
      cpu.status.setFlag(Flag.ZERO, result === 0);

      return;
    }

    // MEMORY
    const { address } = this.config.getAddress(cpu);
    const value = cpu.memory.read(address);

    // Read-Modify-Write
    cpu.memory.write(address, value);

    const carry = (value & 0x01) !== 0;
    const result = (value >> 1) & 0xff;

    cpu.memory.write(address, result);

    cpu.status.setFlag(Flag.CARRY, carry);
    cpu.status.setFlag(Flag.NEGATIVE, false);
    cpu.status.setFlag(Flag.ZERO, result === 0);
  }
}
