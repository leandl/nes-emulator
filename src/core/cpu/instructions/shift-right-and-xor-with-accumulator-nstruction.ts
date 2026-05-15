import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import { Instruction } from "./instruction";

type ShiftRightAndXorWithAccumulatorInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class ShiftRightAndXorWithAccumulatorInstruction implements Instruction {
  constructor(
    private config: ShiftRightAndXorWithAccumulatorInstructionConfig,
  ) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);
    const value = cpu.read(address);

    // LSR
    const newCarry = (value & 0x01) !== 0;
    const shifted = (value >> 1) & 0xff;

    cpu.write(address, shifted);

    // EOR with accumulator
    const result = cpu.registers.A ^ shifted;
    cpu.registers.A = result;

    // Flags
    cpu.registers.STATUS.setFlag(Flag.CARRY, newCarry);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
