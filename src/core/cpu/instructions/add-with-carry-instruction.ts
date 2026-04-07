import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

export class AddWithCarryInstruction implements Instruction {
  constructor(private getAddress: AddressResolver) {}

  execute(cpu: CPU) {
    const { address } = this.getAddress(cpu);
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
  }
}
