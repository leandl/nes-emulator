import { Addressing } from "./addressing";
import { CPUMemory } from "./cpu-memory";
import { CPUStatus } from "./cpu-status";
import type { Instruction } from "./instructions/instruction";

import { Opcode } from "./opcode";
import { Registers } from "./registers";

export class CPU {
  registers = new Registers();
  status = new CPUStatus();
  memory = new CPUMemory();

  constructor(private instructions: Record<Opcode, Instruction>) {}

  step() {
    const address = Addressing.immediate(this);
    const opcode = this.memory.read(address) as Opcode;

    const instruction = this.instructions[opcode];
    if (!instruction) {
      throw new Error(
        `Opcode não implementado: 0x${opcode.toString(16).padStart(2, "0")}`,
      );
    }

    instruction.execute(this);
  }
}
