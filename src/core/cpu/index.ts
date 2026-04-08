import { Addressing } from "./addressing";
import { Memory } from "./memory";
import { CPUStatus } from "./cpu-status";
import type { Instruction } from "./instructions/instruction";

import { Opcode } from "./opcode";
import { Registers } from "./registers";

export class CPU {
  registers = new Registers();
  status = new CPUStatus();
  memory = new Memory();

  cycles = 0;

  constructor(private instructions: Record<Opcode, Instruction>) {}

  loadProgram(program: number[], startAddress = 0x8000) {
    this.memory.load(program, startAddress);
    this.registers.PC = startAddress;
  }

  step() {
    const { address } = Addressing.immediate(this);
    const opcode = this.memory.read(address) as Opcode;

    const instruction = this.instructions[opcode];
    if (!instruction) {
      throw new Error(
        `Opcode não implementado: 0x${opcode.toString(16).padStart(2, "0")}`,
      );
    }

    const cycles = instruction.execute(this);
    if (cycles) {
      this.cycles += cycles;
    }
  }
}
