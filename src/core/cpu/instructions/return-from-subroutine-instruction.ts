import type { CPU } from "..";
import { Stack } from "../stack";
import type { Instruction } from "./instruction";

export class ReturnFromSubroutineInstruction implements Instruction {
  execute(cpu: CPU) {
    const returnLow = Stack.pull(cpu); // pull LOW
    const returnHigh = Stack.pull(cpu); // pull HIGH

    const returnAddress = (returnHigh << 8) | returnLow;

    // jump
    cpu.registers.PC = returnAddress + 1;

    return 6; // cycles
  }
}
