import { Opcode, BitwiseOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import {
  BitwiseOperator,
  BitwiseOperatorInstruction,
} from "../../instructions/bitwise-operator-instruction";
import { Addressing } from "../../addressing";
import { BitTestInstruction } from "../../instructions/bit-test-instruction";

export const allBitwiseInstructions: Record<BitwiseOpcode, Instruction> = {
  // Bitwise AND
  [Opcode.BITWISE_AND_IMMEDIATE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.BITWISE_AND_ZERO_PAGE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.BITWISE_AND_ZERO_PAGE_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.BITWISE_AND_ABSOLUTE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.BITWISE_AND_ABSOLUTE_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.absoluteX,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.BITWISE_AND_ABSOLUTE_Y]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.absoluteY,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.BITWISE_AND_INDIRECT_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),
  [Opcode.BITWISE_AND_INDIRECT_Y]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.AND,
    getAddress: Addressing.indirectY,
    baseCycles: 5,
    extraCycleOnPageCross: true,
  }),

  // Bitwise OR
  [Opcode.BITWISE_OR_IMMEDIATE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.BITWISE_OR_ZERO_PAGE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.BITWISE_OR_ZERO_PAGE_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.BITWISE_OR_ABSOLUTE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.BITWISE_OR_ABSOLUTE_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.absoluteX,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.BITWISE_OR_ABSOLUTE_Y]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.absoluteY,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.BITWISE_OR_INDIRECT_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),
  [Opcode.BITWISE_OR_INDIRECT_Y]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.OR,
    getAddress: Addressing.indirectY,
    baseCycles: 5,
    extraCycleOnPageCross: true,
  }),

  // Bitwise Exclusive OR
  [Opcode.BITWISE_EXCLUSIVE_OR_IMMEDIATE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_ZERO_PAGE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_ZERO_PAGE_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.absoluteX,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE_Y]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.absoluteY,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_INDIRECT_X]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),
  [Opcode.BITWISE_EXCLUSIVE_OR_INDIRECT_Y]: new BitwiseOperatorInstruction({
    operator: BitwiseOperator.EXCLUSIVE_OR,
    getAddress: Addressing.indirectY,
    baseCycles: 5,
    extraCycleOnPageCross: true,
  }),

  // Bit Test
  [Opcode.BIT_TEST_ZERO_PAGE]: new BitTestInstruction({
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.BIT_TEST_ABSOLUTE]: new BitTestInstruction({
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
};
