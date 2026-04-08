import type { CPU } from "..";

export interface Instruction {
  execute(cpu: CPU): number; // return cycles
}
