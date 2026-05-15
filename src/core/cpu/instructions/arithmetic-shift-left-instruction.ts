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

type ArithmeticShiftLeftInstructionConfig = RegisterMode | MemoryMode;

export class ArithmeticShiftLeftInstruction implements Instruction {
  constructor(private config: ArithmeticShiftLeftInstructionConfig) {}

  execute(cpu: CPU) {
    // ========================
    // ACCUMULATOR
    // ========================
    if (this.config.mode === "REGISTER") {
      const value = cpu.registers[this.config.register];

      const carry = (value & 0x80) !== 0;
      const result = (value << 1) & 0xff;

      cpu.registers[this.config.register] = result;

      cpu.registers.STATUS.setFlag(Flag.CARRY, carry);
      cpu.registers.STATUS.updateZeroAndNegative(result);

      return 2;
    }

    // ========================
    // MEMORY
    // ========================
    const { address } = this.config.getAddress(cpu);

    const value = cpu.read(address);

    // RMW comportamento real do 6502
    cpu.write(address, value);

    const carry = (value & 0x80) !== 0;
    const result = (value << 1) & 0xff;

    cpu.write(address, result);

    cpu.registers.STATUS.setFlag(Flag.CARRY, carry);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
