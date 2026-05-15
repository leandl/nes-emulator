import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

type Register = CPURegister.ACCUMULATOR | CPURegister.X | CPURegister.Y;

type StoreInstructionConfig = {
  register: Register | [Register, Register];
  getAddress: AddressResolver;
  baseCycles: number;
};

export class StoreInstruction implements Instruction {
  constructor(private config: StoreInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);

    if (this.config.register instanceof Array) {
      const [registerName1, registerName2] = this.config.register;
      cpu.write(
        address,
        cpu.registers[registerName1] & cpu.registers[registerName2],
      );
    } else {
      cpu.write(address, cpu.registers[this.config.register]);
    }

    return this.config.baseCycles;
  }
}
