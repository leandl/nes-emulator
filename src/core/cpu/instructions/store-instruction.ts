import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type StoreInstructionConfig = {
  register: CPURegister;
  getAddress: AddressResolver;
  baseCycles: number;
};

export class StoreInstruction implements Instruction {
  constructor(private config: StoreInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);
    cpu.memory.write(address, cpu.registers[this.config.register]);

    return this.config.baseCycles;
  }
}
