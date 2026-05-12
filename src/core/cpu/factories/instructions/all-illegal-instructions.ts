import { Opcode, IllegalOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { NoOperationInstruction } from "../../instructions/no-operation-instruction";
import { Addressing } from "../../addressing";
import { LoadInstruction } from "../../instructions/load-instruction";
import { CPURegister } from "../../registers";
import { StoreInstruction } from "../../instructions/store-instruction";
import { SubtractWithCarryInstruction } from "../../instructions/subtract-with-carry-instruction";
import { DecrementAndCompareInstruction } from "../../instructions/decrement-and-compare-instruction";
import { IncrementAndSubtractWithCarryInstruction } from "../../instructions/increment-and-subtract-with-carry-instruction";
import { ShiftLeftAndOrInstruction } from "../../instructions/shift-left-and-or-instruction";

export const allIllegalInstructions: Record<IllegalOpcode, Instruction> = {
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

  // Load Accumulator And X Register
  [Opcode.LOAD_ACCUMULATOR_AND_X_REGISTER_ZERO_PAGE]: new LoadInstruction({
    baseCycles: 3,
    getAddress: Addressing.zeroPage,
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
  }),
  [Opcode.LOAD_ACCUMULATOR_AND_X_REGISTER_ZERO_PAGE_Y]: new LoadInstruction({
    baseCycles: 4,
    getAddress: Addressing.zeroPageY,
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
  }),
  [Opcode.LOAD_ACCUMULATOR_AND_X_REGISTER_ABSOLUTE]: new LoadInstruction({
    baseCycles: 4,
    getAddress: Addressing.absolute,
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
  }),
  [Opcode.LOAD_ACCUMULATOR_AND_X_REGISTER_ABSOLUTE_Y]: new LoadInstruction({
    baseCycles: 4,
    getAddress: Addressing.absoluteY,
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
    extraCycleOnPageCross: true,
  }),
  [Opcode.LOAD_ACCUMULATOR_AND_X_REGISTER_INDIRECT_X]: new LoadInstruction({
    baseCycles: 6,
    getAddress: Addressing.indirectX,
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
  }),
  [Opcode.LOAD_ACCUMULATOR_AND_X_REGISTER_INDIRECT_Y]: new LoadInstruction({
    baseCycles: 5,
    getAddress: Addressing.indirectY,
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
    extraCycleOnPageCross: true,
  }),

  // Store Accumulator
  [Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_ZERO_PAGE]: new StoreInstruction({
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_ZERO_PAGE_Y]: new StoreInstruction({
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
    getAddress: Addressing.zeroPageY,
    baseCycles: 4,
  }),
  [Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_ABSOLUTE]: new StoreInstruction({
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_INDIRECT_X]: new StoreInstruction({
    register: [CPURegister.ACCUMULATOR, CPURegister.X],
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),

  // Subtract with Carry
  [Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB]: new SubtractWithCarryInstruction({
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),

  // Decrement Memory then Compare Accumulator (DCP - illegal opcode)
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.zeroPage,
      baseCycles: 5,
    }),
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE_X]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.zeroPageX,
      baseCycles: 6,
    }),
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ABSOLUTE]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.absolute,
      baseCycles: 6,
    }),
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ABSOLUTE_X]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.absoluteX,
      baseCycles: 7,
    }),
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ABSOLUTE_Y]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.absoluteY,
      baseCycles: 7,
    }),
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_INDIRECT_X]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.indirectX,
      baseCycles: 8,
    }),
  [Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_INDIRECT_Y]:
    new DecrementAndCompareInstruction({
      register: CPURegister.ACCUMULATOR,
      getAddress: Addressing.indirectY,
      baseCycles: 8,
    }),

  // Increment Memory then Subtract with Carry (ISC - illegal opcode)
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.zeroPage,
      baseCycles: 5,
    }),
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE_X]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.zeroPageX,
      baseCycles: 6,
    }),
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ABSOLUTE]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.absolute,
      baseCycles: 6,
    }),
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ABSOLUTE_X]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.absoluteX,
      baseCycles: 7,
    }),
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ABSOLUTE_Y]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.absoluteY,
      baseCycles: 7,
    }),
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_INDIRECT_X]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.indirectX,
      baseCycles: 8,
    }),
  [Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_INDIRECT_Y]:
    new IncrementAndSubtractWithCarryInstruction({
      getAddress: Addressing.indirectY,
      baseCycles: 8,
    }),

  // Shift Left then OR with Accumulator (SLO - illegal opcode)
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.zeroPage,
      baseCycles: 5,
    }),
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE_X]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.zeroPageX,
      baseCycles: 6,
    }),
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ABSOLUTE]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.absolute,
      baseCycles: 6,
    }),
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ABSOLUTE_X]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.absoluteX,
      baseCycles: 7,
    }),
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ABSOLUTE_Y]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.absoluteY,
      baseCycles: 7,
    }),
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_INDIRECT_X]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.indirectX,
      baseCycles: 8,
    }),
  [Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_INDIRECT_Y]:
    new ShiftLeftAndOrInstruction({
      getAddress: Addressing.indirectY,
      baseCycles: 8,
    }),
};
