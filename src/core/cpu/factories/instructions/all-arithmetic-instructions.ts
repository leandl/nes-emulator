import { Addressing } from "../../addressing";
import { Opcode, ArithmeticOpcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { AddWithCarryInstruction } from "../../instructions/add-with-carry-instruction";
import { DecrementInstruction } from "../../instructions/decrement-instruction";
import { DecrementMemoryInstruction } from "../../instructions/decrement-memory-instruction";
import { IncrementInstruction } from "../../instructions/increment-instruction";
import { IncrementMemoryInstruction } from "../../instructions/increment-memory-instruction";
import { Instruction } from "../../instructions/instruction";
import { SubtractWithCarryInstruction } from "../../instructions/subtract-with-carry-instruction";

export const allArithmeticInstructions: Record<ArithmeticOpcode, Instruction> =
  {
    // Increment
    [Opcode.INCREMENT_X_REGISTER]: new IncrementInstruction(CPURegister.X),
    [Opcode.INCREMENT_Y_REGISTER]: new IncrementInstruction(CPURegister.Y),

    // Decrement
    [Opcode.DECREMENT_X_REGISTER]: new DecrementInstruction(CPURegister.X),
    [Opcode.DECREMENT_Y_REGISTER]: new DecrementInstruction(CPURegister.Y),

    // Increment Memory
    [Opcode.INCREMENT_MEMORY_ZERO_PAGE]: new IncrementMemoryInstruction(
      Addressing.zeroPage,
    ),
    [Opcode.INCREMENT_MEMORY_ZERO_PAGE_X]: new IncrementMemoryInstruction(
      Addressing.zeroPageX,
    ),
    [Opcode.INCREMENT_MEMORY_ABSOLUTE]: new IncrementMemoryInstruction(
      Addressing.absolute,
    ),
    [Opcode.INCREMENT_MEMORY_ABSOLUTE_X]: new IncrementMemoryInstruction(
      Addressing.absoluteX,
    ),

    // Decrement Memory
    [Opcode.DECREMENT_MEMORY_ZERO_PAGE]: new DecrementMemoryInstruction(
      Addressing.zeroPage,
    ),
    [Opcode.DECREMENT_MEMORY_ZERO_PAGE_X]: new DecrementMemoryInstruction(
      Addressing.zeroPageX,
    ),
    [Opcode.DECREMENT_MEMORY_ABSOLUTE]: new DecrementMemoryInstruction(
      Addressing.absolute,
    ),
    [Opcode.DECREMENT_MEMORY_ABSOLUTE_X]: new DecrementMemoryInstruction(
      Addressing.absoluteX,
    ),

    // Add with Carry
    [Opcode.ADD_WITH_CARRY_IMMEDIATE]: new AddWithCarryInstruction(
      Addressing.immediate,
    ),
    [Opcode.ADD_WITH_CARRY_ZERO_PAGE]: new AddWithCarryInstruction(
      Addressing.zeroPage,
    ),
    [Opcode.ADD_WITH_CARRY_ZERO_PAGE_X]: new AddWithCarryInstruction(
      Addressing.zeroPageX,
    ),
    [Opcode.ADD_WITH_CARRY_ABSOLUTE]: new AddWithCarryInstruction(
      Addressing.absolute,
    ),
    [Opcode.ADD_WITH_CARRY_ABSOLUTE_X]: new AddWithCarryInstruction(
      Addressing.absoluteX,
    ),
    [Opcode.ADD_WITH_CARRY_ABSOLUTE_Y]: new AddWithCarryInstruction(
      Addressing.absoluteY,
    ),
    [Opcode.ADD_WITH_CARRY_INDIRECT_X]: new AddWithCarryInstruction(
      Addressing.indirectX,
    ),
    [Opcode.ADD_WITH_CARRY_INDIRECT_Y]: new AddWithCarryInstruction(
      Addressing.indirectY,
    ),

    // Subtract with Carry
    [Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE]: new SubtractWithCarryInstruction(
      Addressing.immediate,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_ZERO_PAGE]: new SubtractWithCarryInstruction(
      Addressing.zeroPage,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_ZERO_PAGE_X]: new SubtractWithCarryInstruction(
      Addressing.zeroPageX,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE]: new SubtractWithCarryInstruction(
      Addressing.absolute,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE_X]: new SubtractWithCarryInstruction(
      Addressing.absoluteX,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE_Y]: new SubtractWithCarryInstruction(
      Addressing.absoluteY,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_INDIRECT_X]: new SubtractWithCarryInstruction(
      Addressing.indirectX,
    ),
    [Opcode.SUBTRACT_WITH_CARRY_INDIRECT_Y]: new SubtractWithCarryInstruction(
      Addressing.indirectY,
    ),
  };
