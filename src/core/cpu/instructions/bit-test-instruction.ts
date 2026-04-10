import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

type BitTestInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class BitTestInstruction implements Instruction {
  constructor(private config: BitTestInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);

    const value = cpu.memory.read(address);
    const A = cpu.registers.A;

    const result = A & value;

    cpu.registers.STATUS.setFlag(Flag.ZERO, result === 0);
    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, (value & Flag.NEGATIVE) !== 0);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, (value & Flag.OVERFLOW) !== 0);

    return this.config.baseCycles;
  }
}
