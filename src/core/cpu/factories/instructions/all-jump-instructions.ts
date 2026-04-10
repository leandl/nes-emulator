import { Opcode, JumpOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { Addressing } from "../../addressing";
import { JumpInstruction } from "../../instructions/jump-instruction";
import { JumpToSubroutineInstruction } from "../../instructions/jump-to-subroutine-instruction";
import { ReturnFromSubroutineInstruction } from "../../instructions/return-from-subroutine-instruction";

export const allJumpInstructions: Record<JumpOpcode, Instruction> = {
  // Jump
  [Opcode.JUMP_ABSOLUTE]: new JumpInstruction({
    getAddress: Addressing.absolute,
    baseCycles: 3,
  }),
  [Opcode.JUMP_INDIRECT]: new JumpInstruction({
    getAddress: Addressing.indirect,
    baseCycles: 5,
  }),

  // Jump to Subroutine
  [Opcode.JUMP_TO_SUBROUTINE]: new JumpToSubroutineInstruction(),

  // Return From Subroutine
  [Opcode.RETURN_FROM_SUBROUTINE]: new ReturnFromSubroutineInstruction(),
};
