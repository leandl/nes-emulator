import { Opcode, OtherOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { NoOperationInstruction } from "../../instructions/no-operation-instruction";
import { Addressing } from "../../addressing";

export const allOtherInstructions: Record<OtherOpcode, Instruction> = {
  // System
  [Opcode.NO_OPERATION]: new NoOperationInstruction(),

  // NOP (ILEGAIS)
  //// Immediate
  [Opcode.NO_OPERATION_IMMEDIATE]: new NoOperationInstruction({
    getAddress: Addressing.immediate,
    cycles: 2,
  }),

  //// Zero Page
  [Opcode.NO_OPERATION_ZERO_PAGE_04]: new NoOperationInstruction({
    getAddress: Addressing.zeroPage,
    cycles: 3,
  }),
  [Opcode.NO_OPERATION_ZERO_PAGE_44]: new NoOperationInstruction({
    getAddress: Addressing.zeroPage,
    cycles: 3,
  }),
  [Opcode.NO_OPERATION_ZERO_PAGE_64]: new NoOperationInstruction({
    getAddress: Addressing.zeroPage,
    cycles: 3,
  }),

  //// Zero Page,X
  [Opcode.NO_OPERATION_ZERO_X_14]: new NoOperationInstruction({
    getAddress: Addressing.zeroPageX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ZERO_X_34]: new NoOperationInstruction({
    getAddress: Addressing.zeroPageX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ZERO_X_54]: new NoOperationInstruction({
    getAddress: Addressing.zeroPageX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ZERO_X_74]: new NoOperationInstruction({
    getAddress: Addressing.zeroPageX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ZERO_X_D4]: new NoOperationInstruction({
    getAddress: Addressing.zeroPageX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ZERO_X_F4]: new NoOperationInstruction({
    getAddress: Addressing.zeroPageX,
    cycles: 4,
  }),

  //// Absolute
  [Opcode.NO_OPERATION_ABSOLUTE]: new NoOperationInstruction({
    getAddress: Addressing.absolute,
    cycles: 4,
  }),

  //// Absolute,X
  [Opcode.NO_OPERATION_ABSOLUTE_X_1C]: new NoOperationInstruction({
    getAddress: Addressing.absoluteX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ABSOLUTE_X_3C]: new NoOperationInstruction({
    getAddress: Addressing.absoluteX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ABSOLUTE_X_5C]: new NoOperationInstruction({
    getAddress: Addressing.absoluteX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ABSOLUTE_X_7C]: new NoOperationInstruction({
    getAddress: Addressing.absoluteX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ABSOLUTE_X_DC]: new NoOperationInstruction({
    getAddress: Addressing.absoluteX,
    cycles: 4,
  }),
  [Opcode.NO_OPERATION_ABSOLUTE_X_FC]: new NoOperationInstruction({
    getAddress: Addressing.absoluteX,
    cycles: 4,
  }),

  //// Implied (ilegais)
  [Opcode.NO_OPERATION_1A]: new NoOperationInstruction(),
  [Opcode.NO_OPERATION_3A]: new NoOperationInstruction(),
  [Opcode.NO_OPERATION_5A]: new NoOperationInstruction(),
  [Opcode.NO_OPERATION_7A]: new NoOperationInstruction(),
  [Opcode.NO_OPERATION_DA]: new NoOperationInstruction(),
  [Opcode.NO_OPERATION_FA]: new NoOperationInstruction(),
};
