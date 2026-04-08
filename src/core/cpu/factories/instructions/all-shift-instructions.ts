import { Opcode, ShiftOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { ArithmeticShiftLeftInstruction } from "../../instructions/arithmetic-shift-left-instruction";
import { CPURegister } from "../../registers";
import { Addressing } from "../../addressing";
import { LogicalShiftRightInstruction } from "../../instructions/logical-shift-right-instruction";
import { RotateLeftInstruction } from "../../instructions/rotate-left-instruction";
import { RotateRightInstruction } from "../../instructions/rotate-right-instruction";

export const allShiftInstructions: Record<ShiftOpcode, Instruction> = {
  // Arithmetic Shift Left
  [Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR]:
    new ArithmeticShiftLeftInstruction({
      mode: "REGISTER",
      register: CPURegister.ACCUMULATOR,
    }),
  [Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE]: new ArithmeticShiftLeftInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPage,
    baseCycles: 5,
  }),
  [Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE_X]:
    new ArithmeticShiftLeftInstruction({
      mode: "MEMORY",
      getAddress: Addressing.zeroPageX,
      baseCycles: 6,
    }),
  [Opcode.ARITHMETIC_SHIFT_LEFT_ABSOLUTE]: new ArithmeticShiftLeftInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absolute,
    baseCycles: 6,
  }),
  [Opcode.ARITHMETIC_SHIFT_LEFT_ABSOLUTE_X]: new ArithmeticShiftLeftInstruction(
    {
      mode: "MEMORY",
      getAddress: Addressing.absoluteX,
      baseCycles: 7,
    },
  ),

  // Logical Shift Right
  [Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR]: new LogicalShiftRightInstruction({
    mode: "REGISTER",
    register: CPURegister.ACCUMULATOR,
  }),
  [Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE]: new LogicalShiftRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPage,
    baseCycles: 5,
  }),
  [Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE_X]: new LogicalShiftRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPageX,
    baseCycles: 6,
  }),
  [Opcode.LOGICAL_SHIFT_RIGHT_ABSOLUTE]: new LogicalShiftRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absolute,
    baseCycles: 6,
  }),
  [Opcode.LOGICAL_SHIFT_RIGHT_ABSOLUTE_X]: new LogicalShiftRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absoluteX,
    baseCycles: 7,
  }),

  // Rotate Left
  [Opcode.ROTATE_LEFT_ACCUMULATOR]: new RotateLeftInstruction({
    mode: "REGISTER",
    register: CPURegister.ACCUMULATOR,
  }),
  [Opcode.ROTATE_LEFT_ZERO_PAGE]: new RotateLeftInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPage,
    baseCycles: 5,
  }),
  [Opcode.ROTATE_LEFT_ZERO_PAGE_X]: new RotateLeftInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPageX,
    baseCycles: 6,
  }),
  [Opcode.ROTATE_LEFT_ABSOLUTE]: new RotateLeftInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absolute,
    baseCycles: 6,
  }),
  [Opcode.ROTATE_LEFT_ABSOLUTE_X]: new RotateLeftInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absoluteX,
    baseCycles: 7,
  }),

  // Rotate Right
  [Opcode.ROTATE_RIGHT_ACCUMULATOR]: new RotateRightInstruction({
    mode: "REGISTER",
    register: CPURegister.ACCUMULATOR,
  }),
  [Opcode.ROTATE_RIGHT_ZERO_PAGE]: new RotateRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPage,
    baseCycles: 5,
  }),
  [Opcode.ROTATE_RIGHT_ZERO_PAGE_X]: new RotateRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.zeroPageX,
    baseCycles: 6,
  }),
  [Opcode.ROTATE_RIGHT_ABSOLUTE]: new RotateRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absolute,
    baseCycles: 6,
  }),
  [Opcode.ROTATE_RIGHT_ABSOLUTE_X]: new RotateRightInstruction({
    mode: "MEMORY",
    getAddress: Addressing.absoluteX,
    baseCycles: 7,
  }),
};
