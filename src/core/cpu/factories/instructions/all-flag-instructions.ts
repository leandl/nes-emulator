import { Opcode, FlagOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { ModifyFlagInstruction } from "../../instructions/modify-flag-instruction";
import { Flag } from "../../flag";

export const allFlagInstructions: Record<FlagOpcode, Instruction> = {
  //// Carry
  [Opcode.CLEAR_CARRY_FLAG]: new ModifyFlagInstruction(Flag.CARRY, false),
  [Opcode.SET_CARRY_FLAG]: new ModifyFlagInstruction(Flag.CARRY, true),

  //// Interrupt
  [Opcode.CLEAR_INTERRUPT_FLAG]: new ModifyFlagInstruction(
    Flag.INTERRUPT_DISABLE,
    false,
  ),
  [Opcode.SET_INTERRUPT_FLAG]: new ModifyFlagInstruction(
    Flag.INTERRUPT_DISABLE,
    true,
  ),

  //// Decimal
  [Opcode.CLEAR_DECIMAL_FLAG]: new ModifyFlagInstruction(Flag.DECIMAL, false),
  [Opcode.SET_DECIMAL_FLAG]: new ModifyFlagInstruction(Flag.DECIMAL, true),

  //// Overflow
  [Opcode.CLEAR_OVERFLOW_FLAG]: new ModifyFlagInstruction(Flag.OVERFLOW, false),
};
