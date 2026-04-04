import type { CPU } from "..";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

const incrementMap = {
  [CPURegister.X]: (cpu: CPU) => cpu.registers.incrementX(),
  [CPURegister.Y]: (cpu: CPU) => cpu.registers.incrementY(),
} as const;

export class IncrementInstruction implements Instruction {
  constructor(
    private register: Exclude<CPURegister, CPURegister.ACCUMULATOR>,
  ) {}

  execute(cpu: CPU) {
    incrementMap[this.register](cpu);

    const value = cpu.registers[this.register];
    cpu.status.updateZeroAndNegative(value);
  }
}
