import { CPU } from "..";
import { CPURegister } from "../registers";
import { Instruction } from "./instruction";

type TransferInstructionConfig = {
  source: CPURegister;
  destination: CPURegister;
};

export class TransferInstruction implements Instruction {
  constructor(private config: TransferInstructionConfig) {}

  execute(cpu: CPU) {
    const value = cpu.registers[this.config.source];

    cpu.registers[this.config.destination] = value;
    cpu.status.updateZeroAndNegative(value);

    return 2; // cycles
  }
}
