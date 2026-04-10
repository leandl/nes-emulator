import { CPU } from "..";
import { CPURegister } from "../registers";
import { Instruction } from "./instruction";

type TransferableRegister =
  | CPURegister.ACCUMULATOR
  | CPURegister.X
  | CPURegister.Y
  | CPURegister.STACK_POINTER;

type TransferInstructionConfig = {
  source: TransferableRegister;
  destination: TransferableRegister;
};

export class TransferInstruction implements Instruction {
  constructor(private config: TransferInstructionConfig) {}

  execute(cpu: CPU) {
    const value = this.readRegister(cpu, this.config.source);

    this.writeRegister(cpu, this.config.destination, value);
    if (this.shouldUpdateFlags(this.config.destination)) {
      cpu.registers.STATUS.updateZeroAndNegative(value);
    }

    return 2;
  }

  private readRegister(cpu: CPU, register: TransferableRegister): number {
    return cpu.registers[register];
  }

  private writeRegister(
    cpu: CPU,
    register: TransferableRegister,
    value: number,
  ): void {
    cpu.registers[register] = value;
  }

  private shouldUpdateFlags(register: TransferableRegister): boolean {
    // TXS não altera flags (destino = SP)
    return register !== CPURegister.STACK_POINTER;
  }
}
