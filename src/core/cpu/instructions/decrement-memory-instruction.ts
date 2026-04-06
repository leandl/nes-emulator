import type { CPU } from "..";
import { AddressResolver } from "../addressing";
import type { Instruction } from "./instruction";

export class DecrementMemoryInstruction implements Instruction {
  constructor(private getAddress: AddressResolver) {}

  execute(cpu: CPU) {
    const addr = this.getAddress(cpu);

    const oldValue = cpu.memory.read(addr);
    cpu.memory.write(addr, oldValue - 1);

    const newValue = cpu.memory.read(addr);

    cpu.status.updateZeroAndNegative(newValue);
  }
}
