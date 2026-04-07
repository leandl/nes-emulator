import { Addressing } from "../../addressing";
import { AccessOpcode, Opcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { Instruction } from "../../instructions/instruction";
import { LoadInstruction } from "../../instructions/load-instruction";
import { StoreInstruction } from "../../instructions/store-instruction";

export const allAccessInstructions: Record<AccessOpcode, Instruction> = {
  // Load Accumulator
  [Opcode.LOAD_ACCUMULATOR_IMMEDIATE]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.immediate,
  ),
  [Opcode.LOAD_ACCUMULATOR_ZERO_PAGE]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.zeroPage,
  ),
  [Opcode.LOAD_ACCUMULATOR_ZERO_PAGE_X]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.zeroPageX,
  ),
  [Opcode.LOAD_ACCUMULATOR_ABSOLUTE]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.absolute,
  ),
  [Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.absoluteX,
  ),
  [Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.absoluteY,
  ),
  [Opcode.LOAD_ACCUMULATOR_INDIRECT_X]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.indirectX,
  ),
  [Opcode.LOAD_ACCUMULATOR_INDIRECT_Y]: new LoadInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.indirectY,
  ),

  // Load X Register
  [Opcode.LOAD_X_REGISTER_IMMEDIATE]: new LoadInstruction(
    CPURegister.X,
    Addressing.immediate,
  ),
  [Opcode.LOAD_X_REGISTER_ZERO_PAGE]: new LoadInstruction(
    CPURegister.X,
    Addressing.zeroPage,
  ),
  [Opcode.LOAD_X_REGISTER_ZERO_PAGE_Y]: new LoadInstruction(
    CPURegister.X,
    Addressing.zeroPageY,
  ),
  [Opcode.LOAD_X_REGISTER_ABSOLUTE]: new LoadInstruction(
    CPURegister.X,
    Addressing.absolute,
  ),
  [Opcode.LOAD_X_REGISTER_ABSOLUTE_Y]: new LoadInstruction(
    CPURegister.X,
    Addressing.absoluteY,
  ),

  // Load Y Register
  [Opcode.LOAD_Y_REGISTER_IMMEDIATE]: new LoadInstruction(
    CPURegister.Y,
    Addressing.immediate,
  ),
  [Opcode.LOAD_Y_REGISTER_ZERO_PAGE]: new LoadInstruction(
    CPURegister.Y,
    Addressing.zeroPage,
  ),
  [Opcode.LOAD_Y_REGISTER_ZERO_PAGE_X]: new LoadInstruction(
    CPURegister.Y,
    Addressing.zeroPageX,
  ),
  [Opcode.LOAD_Y_REGISTER_ABSOLUTE]: new LoadInstruction(
    CPURegister.Y,
    Addressing.absolute,
  ),
  [Opcode.LOAD_Y_REGISTER_ABSOLUTE_X]: new LoadInstruction(
    CPURegister.Y,
    Addressing.absoluteX,
  ),

  // Store Accumulator
  [Opcode.STORE_ACCUMULATOR_ZERO_PAGE]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.zeroPage,
  ),
  [Opcode.STORE_ACCUMULATOR_ZERO_PAGE_X]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.zeroPageX,
  ),
  [Opcode.STORE_ACCUMULATOR_ABSOLUTE]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.absolute,
  ),
  [Opcode.STORE_ACCUMULATOR_ABSOLUTE_X]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.absoluteX,
  ),
  [Opcode.STORE_ACCUMULATOR_ABSOLUTE_Y]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.absoluteY,
  ),
  [Opcode.STORE_ACCUMULATOR_INDIRECT_X]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.indirectX,
  ),
  [Opcode.STORE_ACCUMULATOR_INDIRECT_Y]: new StoreInstruction(
    CPURegister.ACCUMULATOR,
    Addressing.indirectY,
  ),

  // Store X Register
  [Opcode.STORE_X_REGISTER_ZERO_PAGE]: new StoreInstruction(
    CPURegister.X,
    Addressing.zeroPage,
  ),
  [Opcode.STORE_X_REGISTER_ZERO_PAGE_Y]: new StoreInstruction(
    CPURegister.X,
    Addressing.zeroPageY,
  ),
  [Opcode.STORE_X_REGISTER_ABSOLUTE]: new StoreInstruction(
    CPURegister.X,
    Addressing.absolute,
  ),

  // Store Y Register
  [Opcode.STORE_Y_REGISTER_ZERO_PAGE]: new StoreInstruction(
    CPURegister.Y,
    Addressing.zeroPage,
  ),
  [Opcode.STORE_Y_REGISTER_ZERO_PAGE_X]: new StoreInstruction(
    CPURegister.Y,
    Addressing.zeroPageX,
  ),
  [Opcode.STORE_Y_REGISTER_ABSOLUTE]: new StoreInstruction(
    CPURegister.Y,
    Addressing.absolute,
  ),
};
