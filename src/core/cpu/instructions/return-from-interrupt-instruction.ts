import type { CPU } from "..";
import { Stack } from "../stack";
import type { Instruction } from "./instruction";

export class ReturnFromInterruptInstruction implements Instruction {
  execute(cpu: CPU) {
    const flags = Stack.pull(cpu);
    cpu.registers.STATUS.setFromStackPull(flags);

    const low = Stack.pull(cpu);
    const high = Stack.pull(cpu);

    const address = (high << 8) | low;

    cpu.registers.PC = address;
    return 6; // cycles
  }
}
