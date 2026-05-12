import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

type ShiftLeftAndOrInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class ShiftLeftAndOrInstruction implements Instruction {
  constructor(private config: ShiftLeftAndOrInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);

    const value = cpu.read(address);

    // Captura bit 7 antes do shift (vai para carry)
    const carry = (value & 0x80) !== 0;

    // ASL
    const shifted = (value << 1) & 0xff;

    cpu.write(address, shifted);

    // ORA com acumulador
    const result = cpu.registers.A | shifted;
    cpu.registers.A = result;

    // Flags
    cpu.registers.STATUS.setFlag(Flag.CARRY, carry);
    cpu.registers.STATUS.updateZeroAndNegative(result);

    return this.config.baseCycles;
  }
}
