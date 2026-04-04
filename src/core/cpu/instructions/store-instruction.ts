import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

export class StoreInstruction implements Instruction {
  constructor(
    private register: CPURegister,
    private getAddress: AddressResolver,
  ) {}

  execute(cpu: CPU) {
    const address = this.getAddress(cpu);
    cpu.memory.write(address, cpu.registers[this.register]);
  }
}
