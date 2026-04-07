import { Addressing } from "../../addressing";
import { Flag } from "../../flag";
import { Opcode } from "../../opcode";
import type { Instruction } from "../../instructions/instruction";
import { JumpInstruction } from "../../instructions/jump-instruction";
import { ModifyFlagInstruction } from "../../instructions/modify-flag-instruction";
import { NotImplementedInstruction } from "../../instructions/not-implement-instruction";
import { allAccessInstructions } from "./all-access-instructions";
import { allArithmeticInstructions } from "./all-arithmetic-instructions";
import { allOtherInstructions } from "./all-other-instructions";
import { allTransferInstructions } from "./all-transfer-instruction";
import { allShiftInstructions } from "./all-shift-instructions";

export const allInstruction: Record<Opcode, Instruction> = {
  // Access
  ...allAccessInstructions,

  // Transfer
  ...allTransferInstructions,

  // Arithmetic
  ...allArithmeticInstructions,

  // Shift
  ...allShiftInstructions,

  // Jump
  [Opcode.JUMP_ABSOLUTE]: new JumpInstruction(Addressing.absolute),
  [Opcode.JUMP_INDIRECT]: new JumpInstruction(Addressing.indirect),

  // Branch
  [Opcode.BRANCH_IF_EQUAL]: new NotImplementedInstruction(),
  [Opcode.BRANCH_IF_NOT_EQUAL]: new NotImplementedInstruction(),

  // Flags
  [Opcode.SET_CARRY_FLAG]: new ModifyFlagInstruction(Flag.CARRY, true),
  [Opcode.CLEAR_CARRY_FLAG]: new ModifyFlagInstruction(Flag.CARRY, false),

  // Other
  ...allOtherInstructions,
};
