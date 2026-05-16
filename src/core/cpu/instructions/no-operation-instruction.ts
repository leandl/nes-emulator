import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { Instruction } from "./instruction";

type NoOperationInstructionConfig = {
  getAddress?: AddressResolver;
  cycles?: number;
};

const DEFAULT_NO_OPERATION_CYCLES = 2;

export class NoOperationInstruction implements Instruction {
  constructor(private config?: NoOperationInstructionConfig) {}

  execute(cpu: CPU) {
    const cycles = this.config?.cycles ?? DEFAULT_NO_OPERATION_CYCLES;

    // NOP ilegal com addressing -> precisa fazer leitura dummy
    if (this.config?.getAddress) {
      const { address, pageCrossed } = this.config.getAddress(cpu);

      cpu.read(address);

      return cycles + (pageCrossed ? 1 : 0);
    }

    return cycles;
  }
}
