import type { CPU } from "..";
import type { Instruction } from "./instruction";

export class NotImplementedInstruction implements Instruction {
  execute(_cpu: CPU) {
    throw new Error(`Opcode não implementado`);
  }
}
