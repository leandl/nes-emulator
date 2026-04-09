import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

type SubtractWithCarryInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
  extraCycleOnPageCross?: boolean;
};

export class SubtractWithCarryInstruction implements Instruction {
  constructor(private config: SubtractWithCarryInstructionConfig) {}

  execute(cpu: CPU) {
    const { address, pageCrossed } = this.config.getAddress(cpu);
    const value = cpu.memory.read(address);

    const A = cpu.registers.A;
    const carryIn = cpu.registers.STATUS.is(Flag.CARRY) ? 1 : 0;

    // Inverte o valor (complemento de 1)
    const inverted = value ^ 0xff;

    const sum = A + inverted + carryIn;
    const result = sum & 0xff;

    const isOverflow = (~(A ^ inverted) & (A ^ result) & 0x80) !== 0;

    cpu.registers.A = result;
    // Flags
    cpu.registers.STATUS.setFlag(Flag.CARRY, sum > 0xff);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, isOverflow);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    let cycles = this.config.baseCycles;
    if (this.config.extraCycleOnPageCross && pageCrossed) {
      cycles += 1;
    }

    return cycles;
  }
}
