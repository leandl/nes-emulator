import type { CPU } from "..";
import { Addressing } from "../addressing";
import { Flag } from "../flag";
import type { Instruction } from "./instruction";

type BranchInstructionConfig = {
  flag: Flag;
  expected: boolean;
  baseCycles: number;
};

export class BranchInstruction implements Instruction {
  constructor(private config: BranchInstructionConfig) {}

  execute(cpu: CPU) {
    const { address: offset } = Addressing.relative(cpu);

    let cycles = this.config.baseCycles;

    const flagValue = cpu.registers.STATUS.is(this.config.flag);

    if (flagValue === this.config.expected) {
      cycles += 1;

      const basePC = cpu.registers.PC;
      const newPC = basePC + offset;

      // page crossing (comparando PC pós-instrução)
      if ((basePC & 0xff00) !== (newPC & 0xff00)) {
        cycles += 1;
      }

      cpu.registers.PC = newPC;
    }

    return cycles;
  }
}
