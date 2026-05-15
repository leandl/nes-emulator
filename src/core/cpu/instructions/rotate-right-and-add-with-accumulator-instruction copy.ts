import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import { Instruction } from "./instruction";

type RotateRightAndAddWithAccumulatorInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class RotateRightAndAddWithAccumulatorInstruction implements Instruction {
  constructor(
    private config: RotateRightAndAddWithAccumulatorInstructionConfig,
  ) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);
    const value = cpu.read(address);

    const status = cpu.registers.STATUS;

    // --- ROR ---
    const carryIn = status.is(Flag.CARRY);
    const newCarryFromRor = (value & 0x01) !== 0;

    const rotated = ((value >> 1) | (Number(carryIn) << 7)) & 0xff;

    cpu.write(address, rotated);

    // --- ADC ---
    const A = cpu.registers.A;
    const carryInAdc = newCarryFromRor ? 1 : 0;

    const sum = A + rotated + carryInAdc;
    const result = sum & 0xff;

    // Carry final (ADC)
    status.setFlag(Flag.CARRY, sum > 0xff);

    // Overflow
    const overflow = (~(A ^ rotated) & (A ^ result) & 0x80) !== 0;
    status.setFlag(Flag.OVERFLOW, overflow);

    cpu.registers.A = result;

    status.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
