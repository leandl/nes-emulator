import type { CPU } from "..";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

const STACK_BASE = 0x0100;

type StackInstructionConfig = {
  mode: "PUSH" | "PULL";
  register: CPURegister.ACCUMULATOR | CPURegister.STATUS;
};

export class StackInstruction implements Instruction {
  constructor(private config: StackInstructionConfig) {}

  execute(cpu: CPU) {
    if (this.config.mode === "PUSH") {
      return this.push(cpu);
    }

    return this.pull(cpu);
  }

  private push(cpu: CPU): number {
    const value = this.getValueForPush(cpu);

    const address = STACK_BASE + cpu.registers.SP;
    cpu.memory.write(address, value);

    cpu.registers.decrementSP();

    return 3; // cycles
  }

  private pull(cpu: CPU): number {
    cpu.registers.incrementSP();

    const address = STACK_BASE + cpu.registers.SP;
    const value = cpu.memory.read(address);

    this.setValueFromPull(cpu, value);

    return 4; // cycles
  }

  private getValueForPush(cpu: CPU): number {
    if (this.config.register === CPURegister.ACCUMULATOR) {
      return cpu.registers.A;
    }

    return cpu.registers.STATUS.getForStackPush();
  }

  private setValueFromPull(cpu: CPU, value: number): void {
    if (this.config.register === CPURegister.ACCUMULATOR) {
      cpu.registers.A = value;
      cpu.registers.STATUS.updateZeroAndNegative(value);
      return;
    }

    cpu.registers.STATUS.setFromStackPull(value);
  }
}
