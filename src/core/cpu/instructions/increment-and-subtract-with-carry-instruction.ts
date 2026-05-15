import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

type IncrementAndSubtractWithCarryInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class IncrementAndSubtractWithCarryInstruction implements Instruction {
  constructor(private config: IncrementAndSubtractWithCarryInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);

    const value = cpu.read(address);
    const newValue = (value + 1) & 0xff;
    cpu.write(address, newValue);

    const A = cpu.registers.A;
    const carryIn = cpu.registers.STATUS.is(Flag.CARRY) ? 1 : 0;

    // Inverte o valor (complemento de 1)
    const inverted = newValue ^ 0xff;

    const sum = A + inverted + carryIn;
    const result = sum & 0xff;

    const isOverflow = (~(A ^ inverted) & (A ^ result) & 0x80) !== 0;

    cpu.registers.A = result;
    // Flags
    cpu.registers.STATUS.setFlag(Flag.CARRY, sum > 0xff);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, isOverflow);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
