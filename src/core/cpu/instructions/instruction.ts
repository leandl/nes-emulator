import type { CPU } from "..";

export interface Instruction {
  execute(cpu: CPU): void | number; // return cycles
}
