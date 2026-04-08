import type { CPU } from "..";
import type { Instruction } from "./instruction";

export class NotImplementedInstruction implements Instruction {
  execute(_cpu: CPU): number {
    throw new Error(`Opcode não implementado`);
  }
}
