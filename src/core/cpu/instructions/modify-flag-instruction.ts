import type { CPU } from "..";
import type { Flag } from "../flag";
import type { Instruction } from "./instruction";

export class ModifyFlagInstruction implements Instruction {
  constructor(
    private flag: Flag,
    private value: boolean,
  ) {}

  execute(cpu: CPU) {
    cpu.status.setFlag(this.flag, this.value);
  }
}
