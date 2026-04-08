import { Addressing } from "../../addressing";
import { AccessOpcode, Opcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { Instruction } from "../../instructions/instruction";
import { LoadInstruction } from "../../instructions/load-instruction";
import { StoreInstruction } from "../../instructions/store-instruction";

export const allAccessInstructions: Record<AccessOpcode, Instruction> = {
  // Load Accumulator
  [Opcode.LOAD_ACCUMULATOR_IMMEDIATE]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.LOAD_ACCUMULATOR_ZERO_PAGE]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.LOAD_ACCUMULATOR_ZERO_PAGE_X]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.LOAD_ACCUMULATOR_ABSOLUTE]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absoluteX,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absoluteY,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),
  [Opcode.LOAD_ACCUMULATOR_INDIRECT_X]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),
  [Opcode.LOAD_ACCUMULATOR_INDIRECT_Y]: new LoadInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.indirectY,
    baseCycles: 5,
    extraCycleOnPageCross: true,
  }),

  // Load X Register
  [Opcode.LOAD_X_REGISTER_IMMEDIATE]: new LoadInstruction({
    register: CPURegister.X,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.LOAD_X_REGISTER_ZERO_PAGE]: new LoadInstruction({
    register: CPURegister.X,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.LOAD_X_REGISTER_ZERO_PAGE_Y]: new LoadInstruction({
    register: CPURegister.X,
    getAddress: Addressing.zeroPageY,
    baseCycles: 4,
  }),
  [Opcode.LOAD_X_REGISTER_ABSOLUTE]: new LoadInstruction({
    register: CPURegister.X,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.LOAD_X_REGISTER_ABSOLUTE_Y]: new LoadInstruction({
    register: CPURegister.X,
    getAddress: Addressing.absoluteY,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),

  // Load Y Register
  [Opcode.LOAD_Y_REGISTER_IMMEDIATE]: new LoadInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.immediate,
    baseCycles: 2,
  }),
  [Opcode.LOAD_Y_REGISTER_ZERO_PAGE]: new LoadInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.LOAD_Y_REGISTER_ZERO_PAGE_X]: new LoadInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.LOAD_Y_REGISTER_ABSOLUTE]: new LoadInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.LOAD_Y_REGISTER_ABSOLUTE_X]: new LoadInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.absoluteX,
    baseCycles: 4,
    extraCycleOnPageCross: true,
  }),

  // Store Accumulator
  [Opcode.STORE_ACCUMULATOR_ZERO_PAGE]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.STORE_ACCUMULATOR_ZERO_PAGE_X]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.STORE_ACCUMULATOR_ABSOLUTE]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
  [Opcode.STORE_ACCUMULATOR_ABSOLUTE_X]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absoluteX,
    baseCycles: 5,
  }),
  [Opcode.STORE_ACCUMULATOR_ABSOLUTE_Y]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.absoluteY,
    baseCycles: 5,
  }),
  [Opcode.STORE_ACCUMULATOR_INDIRECT_X]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.indirectX,
    baseCycles: 6,
  }),
  [Opcode.STORE_ACCUMULATOR_INDIRECT_Y]: new StoreInstruction({
    register: CPURegister.ACCUMULATOR,
    getAddress: Addressing.indirectY,
    baseCycles: 6,
  }),

  // Store X Register
  [Opcode.STORE_X_REGISTER_ZERO_PAGE]: new StoreInstruction({
    register: CPURegister.X,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.STORE_X_REGISTER_ZERO_PAGE_Y]: new StoreInstruction({
    register: CPURegister.X,
    getAddress: Addressing.zeroPageY,
    baseCycles: 4,
  }),
  [Opcode.STORE_X_REGISTER_ABSOLUTE]: new StoreInstruction({
    register: CPURegister.X,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),

  // Store Y Register
  [Opcode.STORE_Y_REGISTER_ZERO_PAGE]: new StoreInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.zeroPage,
    baseCycles: 3,
  }),
  [Opcode.STORE_Y_REGISTER_ZERO_PAGE_X]: new StoreInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.zeroPageX,
    baseCycles: 4,
  }),
  [Opcode.STORE_Y_REGISTER_ABSOLUTE]: new StoreInstruction({
    register: CPURegister.Y,
    getAddress: Addressing.absolute,
    baseCycles: 4,
  }),
};
