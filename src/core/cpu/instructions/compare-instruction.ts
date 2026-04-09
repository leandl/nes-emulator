import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import type { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type CompareInstructionConfig = {
  register: CPURegister.ACCUMULATOR | CPURegister.X | CPURegister.Y;
  getAddress: AddressResolver;
  baseCycles: number;
  extraCycleOnPageCross?: boolean;
};

export class CompareInstruction implements Instruction {
  constructor(private config: CompareInstructionConfig) {}

  execute(cpu: CPU) {
    const { address, pageCrossed } = this.config.getAddress(cpu);

    const register = cpu.registers[this.config.register];
    const valueMemory = cpu.memory.read(address);

    const result = (register - valueMemory) & 0xff;

    cpu.registers.STATUS.setFlag(Flag.CARRY, register >= valueMemory);
    cpu.registers.STATUS.setFlag(Flag.ZERO, register === valueMemory);
    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, (result & Flag.NEGATIVE) !== 0);

    let cycles = this.config.baseCycles;
    if (this.config.extraCycleOnPageCross && pageCrossed) {
      cycles += 1;
    }

    return cycles;
  }
}
