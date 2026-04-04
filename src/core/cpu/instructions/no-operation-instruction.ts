import type { CPU } from "..";
import type { Instruction } from "./instruction";

export class NoOperationInstruction implements Instruction {
  execute(_cpu: CPU) {
    // literalmente nada
  }
}
