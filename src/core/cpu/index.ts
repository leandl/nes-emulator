import { Bus } from "../bus";
import { Addressing } from "./addressing";
import type { Instruction } from "./instructions/instruction";

import { Opcode } from "./opcode";
import { Registers } from "./registers";
export class CPU {
  registers = new Registers();
  cycles = 0;

  constructor(
    private bus: Bus,
    private instructions: Record<Opcode, Instruction>,
  ) {}

  read(addr: number): number {
    return this.bus.cpuRead(addr);
  }

  write(addr: number, data: number): void {
    this.bus.cpuWrite(addr, data);
  }

  step() {
    const { address } = Addressing.immediate(this);
    const opcode = this.read(address) as Opcode;

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

  reset() {
    const lo = this.read(0xfffc);
    const hi = this.read(0xfffd);
    this.registers.PC = (hi << 8) | lo;
  }
}
