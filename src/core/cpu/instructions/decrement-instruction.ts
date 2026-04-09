import { CPU } from "..";
import { AddressResolver } from "../addressing";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

const decrementMap = {
  [CPURegister.X]: (cpu: CPU) => cpu.registers.decrementX(),
  [CPURegister.Y]: (cpu: CPU) => cpu.registers.decrementY(),
} as const;

type DecrementRegisterMode = {
  mode: "REGISTER";
  register: CPURegister.X | CPURegister.Y;
};

type DecrementMemoryMode = {
  mode: "MEMORY";
  getAddress: AddressResolver;
  baseCycles: number;
};

type DecrementInstructionConfig = DecrementRegisterMode | DecrementMemoryMode;

export class DecrementInstruction implements Instruction {
  constructor(private config: DecrementInstructionConfig) {}

  execute(cpu: CPU) {
    if (this.config.mode === "MEMORY") {
      const { address } = this.config.getAddress(cpu);

      const oldValue = cpu.memory.read(address);
      cpu.memory.write(address, oldValue - 1);

      const newValue = cpu.memory.read(address);
      cpu.registers.STATUS.updateZeroAndNegative(newValue);
      return this.config.baseCycles;
    }

    decrementMap[this.config.register](cpu);

    const value = cpu.registers[this.config.register];
    cpu.registers.STATUS.updateZeroAndNegative(value);

    return 2; // cycles
  }
}
