import { Addressing } from "../../addressing";
import { Opcode, ArithmeticOpcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { DecrementInstruction } from "../decrement-instruction";
import { DecrementMemoryInstruction } from "../decrement-memory-instruction";
import { IncrementInstruction } from "../increment-instruction";
import { IncrementMemoryInstruction } from "../increment-memory-instruction";
import { Instruction } from "../instruction";

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
  };
