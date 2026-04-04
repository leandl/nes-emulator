import { CPU } from "..";
import { CPURegister } from "../registers";
import { Instruction } from "./instruction";

export class TransferInstruction implements Instruction {
  constructor(
    private source: CPURegister,
    private destination: CPURegister,
  ) {}

  execute(cpu: CPU) {
    const value = cpu.registers[this.source];

    cpu.registers[this.destination] = value;
    cpu.status.updateZeroAndNegative(value);
  }
}
