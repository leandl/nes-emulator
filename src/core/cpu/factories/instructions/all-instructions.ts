import { Addressing } from "../../addressing";
import { Opcode } from "../../opcode";
import type { Instruction } from "../../instructions/instruction";
import { JumpInstruction } from "../../instructions/jump-instruction";
import { NotImplementedInstruction } from "../../instructions/not-implement-instruction";
import { allAccessInstructions } from "./all-access-instructions";
import { allArithmeticInstructions } from "./all-arithmetic-instructions";
import { allOtherInstructions } from "./all-other-instructions";
import { allTransferInstructions } from "./all-transfer-instruction";
import { allShiftInstructions } from "./all-shift-instructions";
import { allFlagInstructions } from "./all-flag-instructions";
import { allBitwiseInstructions } from "./all-bitwise-instructions";
import { allCompareInstructions } from "./all-compare-instructions";
import { allStackInstructions } from "./all-stack-instructions";

export const allInstruction: Record<Opcode, Instruction> = {
  // Access
  ...allAccessInstructions,

  // Transfer
  ...allTransferInstructions,

  // Arithmetic
  ...allArithmeticInstructions,

  // Shift
  ...allShiftInstructions,

  // Bitwise
  ...allBitwiseInstructions,

  // Compare
  ...allCompareInstructions,

  // Jump
  [Opcode.JUMP_ABSOLUTE]: new JumpInstruction({
    getAddress: Addressing.absolute,
    baseCycles: 3,
  }),
  [Opcode.JUMP_INDIRECT]: new JumpInstruction({
    getAddress: Addressing.indirect,
    baseCycles: 5,
  }),

  // Branch
  [Opcode.BRANCH_IF_EQUAL]: new NotImplementedInstruction(),
  [Opcode.BRANCH_IF_NOT_EQUAL]: new NotImplementedInstruction(),

  // Stack
  ...allStackInstructions,

  // Flags
  ...allFlagInstructions,

  // Other
  ...allOtherInstructions,
};
