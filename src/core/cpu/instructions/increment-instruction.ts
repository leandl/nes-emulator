import type { CPU } from "..";
import { AddressResolver } from "../addressing";
import { CPURegister } from "../registers";
import type { Instruction } from "./instruction";

const incrementMap = {
  [CPURegister.X]: (cpu: CPU) => cpu.registers.incrementX(),
  [CPURegister.Y]: (cpu: CPU) => cpu.registers.incrementY(),
} as const;

type IncrementRegisterMode = {
  mode: "REGISTER";
  register: CPURegister.X | CPURegister.Y;
};

type IncrementMemoryMode = {
  mode: "MEMORY";
  getAddress: AddressResolver;
  baseCycles: number;
};

type IncrementInstructionConfig = IncrementRegisterMode | IncrementMemoryMode;

export class IncrementInstruction implements Instruction {
  constructor(private config: IncrementInstructionConfig) {}

  execute(cpu: CPU) {
    if (this.config.mode === "MEMORY") {
      const { address } = this.config.getAddress(cpu);

      const oldValue = cpu.memory.read(address);
      cpu.memory.write(address, oldValue + 1);

      const newValue = cpu.memory.read(address);
      cpu.status.updateZeroAndNegative(newValue);
      return this.config.baseCycles;
    }

    incrementMap[this.config.register](cpu);

    const value = cpu.registers[this.config.register];
    cpu.status.updateZeroAndNegative(value);

    return 2; // cycles
  }
}
