import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

export class SubtractWithCarryInstruction implements Instruction {
  constructor(private getAddress: AddressResolver) {}

  execute(cpu: CPU) {
    const addr = this.getAddress(cpu);
    const value = cpu.memory.read(addr);

    const A = cpu.registers.A;
    const carryIn = cpu.status.is(Flag.CARRY) ? 1 : 0;

    // Inverte o valor (complemento de 1)
    const inverted = value ^ 0xff;

    const sum = A + inverted + carryIn;
    const result = sum & 0xff;

    const isOverflow = (~(A ^ inverted) & (A ^ result) & 0x80) !== 0;

    cpu.registers.A = result;
    // Flags
    cpu.status.setFlag(Flag.CARRY, sum > 0xff);
    cpu.status.setFlag(Flag.OVERFLOW, isOverflow);
    cpu.status.updateZeroAndNegative(result);
  }
}
