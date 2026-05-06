import { Opcode, BranchOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { Flag } from "../../flag";
import { BranchInstruction } from "../../instructions/branch-instruction";

export const allBranchInstructions: Record<BranchOpcode, Instruction> = {
  // Zero Flag
  [Opcode.BRANCH_IF_EQUAL]: new BranchInstruction({
    flag: Flag.ZERO,
    expected: true,
    baseCycles: 2,
  }),
  [Opcode.BRANCH_IF_NOT_EQUAL]: new BranchInstruction({
    flag: Flag.ZERO,
    expected: false,
    baseCycles: 2,
  }),

  // Carry Flag
  [Opcode.BRANCH_IF_CARRY_SET]: new BranchInstruction({
    flag: Flag.CARRY,
    expected: true,
    baseCycles: 2,
  }),
  [Opcode.BRANCH_IF_CARRY_CLEAR]: new BranchInstruction({
    flag: Flag.CARRY,
    expected: false,
    baseCycles: 2,
  }),

  // Negative Flag
  [Opcode.BRANCH_IF_MINUS]: new BranchInstruction({
    flag: Flag.NEGATIVE,
    expected: true,
    baseCycles: 2,
  }),
  [Opcode.BRANCH_IF_POSITIVE]: new BranchInstruction({
    flag: Flag.NEGATIVE,
    expected: false,
    baseCycles: 2,
  }),

  // Overflow Flag
  [Opcode.BRANCH_IF_OVERFLOW_SET]: new BranchInstruction({
    flag: Flag.OVERFLOW,
    expected: true,
    baseCycles: 2,
  }),
  [Opcode.BRANCH_IF_OVERFLOW_CLEAR]: new BranchInstruction({
    flag: Flag.OVERFLOW,
    expected: false,
    baseCycles: 2,
  }),
};
