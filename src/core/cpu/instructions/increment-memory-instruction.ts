import type { CPU } from "..";
import { AddressResolver } from "../addressing";
import type { Instruction } from "./instruction";

export class IncrementMemoryInstruction implements Instruction {
  constructor(private getAddress: AddressResolver) {}

  execute(cpu: CPU) {
    const { address } = this.getAddress(cpu);

    const oldValue = cpu.memory.read(address);
    cpu.memory.write(address, oldValue + 1);

    const newValue = cpu.memory.read(address);
    cpu.status.updateZeroAndNegative(newValue);
  }
}
