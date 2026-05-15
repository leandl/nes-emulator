import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type RotateLeftAndAndWithAccumulatorInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class RotateLeftAndAndWithAccumulatorInstruction implements Instruction {
  constructor(
    private config: RotateLeftAndAndWithAccumulatorInstructionConfig,
  ) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);
    const value = cpu.read(address);

    // ROL
    const carryIn = cpu.registers[CPURegister.STATUS].is(Flag.CARRY);
    const newCarry = (value & 0x80) !== 0;
    const rotated = ((value << 1) | Number(carryIn)) & 0xff;

    cpu.write(address, rotated);

    // AND with accumulator
    const result = cpu.registers.A & rotated;
    cpu.registers.A = result;

    // Flags
    cpu.registers.STATUS.setFlag(Flag.CARRY, newCarry);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
