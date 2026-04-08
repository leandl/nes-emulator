import { Opcode, FlagOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { ModifyFlagInstruction } from "../../instructions/modify-flag-instruction";
import { Flag } from "../../flag";

export const allFlagInstructions: Record<FlagOpcode, Instruction> = {
  //// Carry
  [Opcode.CLEAR_CARRY_FLAG]: new ModifyFlagInstruction({
    flag: Flag.CARRY,
    value: false,
  }),
  [Opcode.SET_CARRY_FLAG]: new ModifyFlagInstruction({
    flag: Flag.CARRY,
    value: true,
  }),

  //// Interrupt
  [Opcode.CLEAR_INTERRUPT_FLAG]: new ModifyFlagInstruction({
    flag: Flag.INTERRUPT_DISABLE,
    value: false,
  }),
  [Opcode.SET_INTERRUPT_FLAG]: new ModifyFlagInstruction({
    flag: Flag.INTERRUPT_DISABLE,
    value: true,
  }),

  //// Decimal
  [Opcode.CLEAR_DECIMAL_FLAG]: new ModifyFlagInstruction({
    flag: Flag.DECIMAL,
    value: false,
  }),
  [Opcode.SET_DECIMAL_FLAG]: new ModifyFlagInstruction({
    flag: Flag.DECIMAL,
    value: true,
  }),

  //// Overflow
  [Opcode.CLEAR_OVERFLOW_FLAG]: new ModifyFlagInstruction({
    flag: Flag.OVERFLOW,
    value: false,
  }),
};
