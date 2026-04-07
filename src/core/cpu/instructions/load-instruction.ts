import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

export class LoadInstruction implements Instruction {
  constructor(
    private register: CPURegister,
    private getAddress: AddressResolver,
  ) {}

  execute(cpu: CPU) {
    const { address } = this.getAddress(cpu);
    const value = cpu.memory.read(address);

    cpu.registers[this.register] = value;
    cpu.status.updateZeroAndNegative(value);
  }
}
