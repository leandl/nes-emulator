import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type LoadInstructionConfig = {
  register: CPURegister.ACCUMULATOR | CPURegister.X | CPURegister.Y;
  getAddress: AddressResolver;
  baseCycles: number;
  extraCycleOnPageCross?: boolean;
};

export class LoadInstruction implements Instruction {
  constructor(private config: LoadInstructionConfig) {}

  execute(cpu: CPU) {
    const { address, pageCrossed } = this.config.getAddress(cpu);
    const value = cpu.memory.read(address);

    cpu.registers[this.config.register] = value;
    cpu.registers.STATUS.updateZeroAndNegative(value);

    let cycles = this.config.baseCycles;
    if (this.config.extraCycleOnPageCross && pageCrossed) {
      cycles += 1;
    }

    return cycles;
  }
}
