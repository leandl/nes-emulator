import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type Register = CPURegister.ACCUMULATOR | CPURegister.X | CPURegister.Y;

type LoadInstructionConfig = {
  register: Register | [Register, Register];
  getAddress: AddressResolver;
  baseCycles: number;
  extraCycleOnPageCross?: boolean;
};

export class LoadInstruction implements Instruction {
  constructor(private config: LoadInstructionConfig) {}

  execute(cpu: CPU) {
    const { address, pageCrossed } = this.config.getAddress(cpu);
    const value = cpu.read(address);

    if (this.config.register instanceof Array) {
      for (let index = 0; index < this.config.register.length; index++) {
        const registerName = this.config.register[index];
        cpu.registers[registerName] = value;
      }
    } else {
      cpu.registers[this.config.register] = value;
    }

    cpu.registers.STATUS.updateZeroAndNegative(value);

    let cycles = this.config.baseCycles;
    if (this.config.extraCycleOnPageCross && pageCrossed) {
      cycles += 1;
    }

    return cycles;
  }
}
