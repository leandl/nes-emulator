import type { CPU } from "..";
import type { AddressResolver } from "../addressing";
import type { Instruction } from "./instruction";

export enum BitwiseOperator {
  AND = "AND",
  OR = "OR",
  EXCLUSIVE_OR = "EXCLUSIVE_OR",
}

const operatorMap = {
  [BitwiseOperator.AND]: (v1: number, v2: number) => v1 & v2,
  [BitwiseOperator.OR]: (v1: number, v2: number) => v1 | v2,
  [BitwiseOperator.EXCLUSIVE_OR]: (v1: number, v2: number) => v1 ^ v2,
} as const;

type BitwiseOperatorInstructionConfig = {
  operator: BitwiseOperator;
  getAddress: AddressResolver;
  baseCycles: number;
  extraCycleOnPageCross?: boolean;
};

export class BitwiseOperatorInstruction implements Instruction {
  private operation: (a: number, b: number) => number;

  constructor(private config: BitwiseOperatorInstructionConfig) {
    this.operation = operatorMap[config.operator];
  }

  execute(cpu: CPU) {
    const { address, pageCrossed } = this.config.getAddress(cpu);

    const value = cpu.memory.read(address);
    const A = cpu.registers.A;

    const result = this.operation(A, value);

    cpu.registers.A = result;
    cpu.status.updateZeroAndNegative(result);

    let cycles = this.config.baseCycles;
    if (this.config.extraCycleOnPageCross && pageCrossed) {
      cycles++;
    }

    return cycles;
  }
}
