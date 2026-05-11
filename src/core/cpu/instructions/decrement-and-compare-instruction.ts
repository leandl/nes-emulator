import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { Flag } from "../flag";
import { CPURegister } from "../registers";
import { Instruction } from "./instruction";

type CompareInstructionConfig = {
  register: CPURegister.ACCUMULATOR;
  getAddress: AddressResolver;
  baseCycles: number;
};

export class DecrementAndCompareInstruction implements Instruction {
  constructor(private config: CompareInstructionConfig) {}

  execute(cpu: CPU) {
    const { address } = this.config.getAddress(cpu);

    const value = cpu.read(address);
    const newValue = (value - 1) & 0xff;
    cpu.write(address, newValue);

    const register = cpu.registers[this.config.register];
    const result = (register - newValue) & 0xff;

    cpu.registers.STATUS.setFlag(Flag.CARRY, register >= newValue);
    cpu.registers.STATUS.setFlag(Flag.ZERO, register === newValue);
    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, (result & Flag.NEGATIVE) !== 0);

    return this.config.baseCycles;
  }
}
