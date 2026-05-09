import { Opcode, IllegalOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { NoOperationInstruction } from "../../instructions/no-operation-instruction";
import { Addressing } from "../../addressing";
import { LoadInstruction } from "../../instructions/load-instruction";
import { CPURegister } from "../../registers";
import { StoreInstruction } from "../../instructions/store-instruction";

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

  //// Store Accumulator
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
};
