import { CPU } from "..";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

const decrementMap = {
  [CPURegister.X]: (cpu: CPU) => cpu.registers.decrementX(),
  [CPURegister.Y]: (cpu: CPU) => cpu.registers.decrementY(),
} as const;

export class DecrementInstruction implements Instruction {
  constructor(
    private register: Exclude<CPURegister, CPURegister.ACCUMULATOR>,
  ) {}

  execute(cpu: CPU) {
    decrementMap[this.register](cpu);

    const value = cpu.registers[this.register];
    cpu.status.updateZeroAndNegative(value);
  }
}
