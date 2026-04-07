import type { CPU } from "..";
import type { Flag } from "../flag";
import type { Instruction } from "./instruction";

type ModifyFlagInstructionConfig = {
  flag: Flag;
  value: boolean;
};

export class ModifyFlagInstruction implements Instruction {
  constructor(private config: ModifyFlagInstructionConfig) {}

  execute(cpu: CPU) {
    cpu.status.setFlag(this.config.flag, this.config.value);

    return 2; // cycles
  }
}
