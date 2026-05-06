import type { Opcode } from "../../opcode";
import type { Instruction } from "../../instructions/instruction";

import { allAccessInstructions } from "./all-access-instructions";
import { allArithmeticInstructions } from "./all-arithmetic-instructions";
import { allOtherInstructions } from "./all-other-instructions";
import { allTransferInstructions } from "./all-transfer-instruction";
import { allShiftInstructions } from "./all-shift-instructions";
import { allFlagInstructions } from "./all-flag-instructions";
import { allBitwiseInstructions } from "./all-bitwise-instructions";
import { allCompareInstructions } from "./all-compare-instructions";
import { allStackInstructions } from "./all-stack-instructions";
import { allJumpInstructions } from "./all-jump-instructions";
import { allBranchInstructions } from "./all-branch-instructions";

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

  // Branch
  ...allBranchInstructions,

  // Jump
  ...allJumpInstructions,

  // Stack
  ...allStackInstructions,

  // Flags
  ...allFlagInstructions,

  // Other
  ...allOtherInstructions,
};
