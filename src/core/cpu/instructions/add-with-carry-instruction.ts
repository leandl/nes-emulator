import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

type AddWithCarryInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
  extraCycleOnPageCross?: boolean;
};

export class AddWithCarryInstruction implements Instruction {
  constructor(private config: AddWithCarryInstructionConfig) {}

  execute(cpu: CPU) {
    const { address, pageCrossed } = this.config.getAddress(cpu);
    const value = cpu.memory.read(address);

    const A = cpu.registers.A;
    const carryIn = cpu.status.is(Flag.CARRY) ? 1 : 0;

    const sum = A + value + carryIn;
    const result = sum & 0xff;

    const isOverflow = (~(A ^ value) & (A ^ result) & 0x80) !== 0;

    cpu.registers.A = result;
    // Flags
    cpu.status.setFlag(Flag.CARRY, sum > 0xff);
    cpu.status.setFlag(Flag.OVERFLOW, isOverflow);
    cpu.status.updateZeroAndNegative(result);

    let cycles = this.config.baseCycles;
    if (this.config.extraCycleOnPageCross && pageCrossed) {
      cycles += 1;
    }

    return cycles;
  }
}
