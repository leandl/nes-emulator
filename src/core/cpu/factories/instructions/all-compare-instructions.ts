import { Opcode, CompareOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { CompareInstruction } from "../../instructions/compare-instruction";
import { CPURegister } from "../../registers";
import { Addressing } from "../../addressing";

export const allCompareInstructions: Record<CompareOpcode, Instruction> = {
  // Compare Accumulator
  [Opcode.COMPARE_ACCUMULATOR_IMMEDIATE]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.COMPARE_ACCUMULATOR_ZERO_PAGE]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.COMPARE_ACCUMULATOR_ZERO_PAGE_X]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.COMPARE_ACCUMULATOR_ABSOLUTE]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.COMPARE_ACCUMULATOR_ABSOLUTE_X]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absoluteX,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.COMPARE_ACCUMULATOR_ABSOLUTE_Y]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absoluteY,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.COMPARE_ACCUMULATOR_INDIRECT_X]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),
  [Opcode.COMPARE_ACCUMULATOR_INDIRECT_Y]: new CompareInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.indirectY,
    baseCycles: 5,
    extraCycleOnPageCross: true,
  }),

  // Compare X Register
  [Opcode.COMPARE_X_REGISTER_IMMEDIATE]: new CompareInstruction({
    register: CPURegister.X,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.COMPARE_X_REGISTER_ZERO_PAGE]: new CompareInstruction({
    register: CPURegister.X,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.COMPARE_X_REGISTER_ABSOLUTE]: new CompareInstruction({
    register: CPURegister.X,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),

  // Compare Y Register
  [Opcode.COMPARE_Y_REGISTER_IMMEDIATE]: new CompareInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.COMPARE_Y_REGISTER_ZERO_PAGE]: new CompareInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.COMPARE_Y_REGISTER_ABSOLUTE]: new CompareInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
};
