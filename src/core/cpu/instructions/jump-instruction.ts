import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { Instruction } from "./instruction";

type JumpInstructionConfig = {
  getAddress: AddressResolver;
  baseCycles: number;
};

export class JumpInstruction implements Instruction {
  constructor(private config: JumpInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);
    cpu.registers.PC = address;

    return this.config.baseCycles;
  }
}
