import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { Instruction } from "./instruction";

export class JumpInstruction implements Instruction {
  constructor(private getAddress: AddressResolver) {}

  execute(cpu: CPU) {
    const address = this.getAddress(cpu);
    cpu.registers.PC = address;
  }
}
