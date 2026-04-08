import { Addressing } from "../../addressing";
import { Opcode, ArithmeticOpcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { AddWithCarryInstruction } from "../../instructions/add-with-carry-instruction";
import { DecrementInstruction } from "../../instructions/decrement-instruction";
import { IncrementInstruction } from "../../instructions/increment-instruction";
import { Instruction } from "../../instructions/instruction";
import { SubtractWithCarryInstruction } from "../../instructions/subtract-with-carry-instruction";

export const allArithmeticInstructions: Record<ArithmeticOpcode, Instruction> =
  {
    // Increment
    [Opcode.INCREMENT_X_REGISTER]: new IncrementInstruction({
      mode: "REGISTER",
      register: CPURegister.X,
    }),
    [Opcode.INCREMENT_Y_REGISTER]: new IncrementInstruction({
      mode: "REGISTER",
      register: CPURegister.Y,
    }),

    // Decrement
    [Opcode.DECREMENT_X_REGISTER]: new DecrementInstruction({
      mode: "REGISTER",
      register: CPURegister.X,
    }),
    [Opcode.DECREMENT_Y_REGISTER]: new DecrementInstruction({
      mode: "REGISTER",
      register: CPURegister.Y,
    }),

    // Increment Memory
    [Opcode.INCREMENT_MEMORY_ZERO_PAGE]: new IncrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.zeroPage,
      baseCycles: 5,
    }),
    [Opcode.INCREMENT_MEMORY_ZERO_PAGE_X]: new IncrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.zeroPageX,
      baseCycles: 6,
    }),
    [Opcode.INCREMENT_MEMORY_ABSOLUTE]: new IncrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.absolute,
      baseCycles: 6,
    }),
    [Opcode.INCREMENT_MEMORY_ABSOLUTE_X]: new IncrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.absoluteX,
      baseCycles: 7,
    }),

    // Decrement Memory
    [Opcode.DECREMENT_MEMORY_ZERO_PAGE]: new DecrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.zeroPage,
      baseCycles: 5,
    }),
    [Opcode.DECREMENT_MEMORY_ZERO_PAGE_X]: new DecrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.zeroPageX,
      baseCycles: 6,
    }),
    [Opcode.DECREMENT_MEMORY_ABSOLUTE]: new DecrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.absolute,
      baseCycles: 6,
    }),
    [Opcode.DECREMENT_MEMORY_ABSOLUTE_X]: new DecrementInstruction({
      mode: "MEMORY",
      getAddress: Addressing.absoluteX,
      baseCycles: 7,
    }),

    // Add with Carry
    [Opcode.ADD_WITH_CARRY_IMMEDIATE]: new AddWithCarryInstruction({
      getAddress: Addressing.immediate,
      baseCycles: 2,
    }),
    [Opcode.ADD_WITH_CARRY_ZERO_PAGE]: new AddWithCarryInstruction({
      getAddress: Addressing.zeroPage,
      baseCycles: 3,
    }),
    [Opcode.ADD_WITH_CARRY_ZERO_PAGE_X]: new AddWithCarryInstruction({
      getAddress: Addressing.zeroPageX,
      baseCycles: 4,
    }),
    [Opcode.ADD_WITH_CARRY_ABSOLUTE]: new AddWithCarryInstruction({
      getAddress: Addressing.absolute,
      baseCycles: 4,
    }),
    [Opcode.ADD_WITH_CARRY_ABSOLUTE_X]: new AddWithCarryInstruction({
      getAddress: Addressing.absoluteX,
      baseCycles: 4,
      extraCycleOnPageCross: true,
    }),
    [Opcode.ADD_WITH_CARRY_ABSOLUTE_Y]: new AddWithCarryInstruction({
      getAddress: Addressing.absoluteY,
      baseCycles: 4,
      extraCycleOnPageCross: true,
    }),
    [Opcode.ADD_WITH_CARRY_INDIRECT_X]: new AddWithCarryInstruction({
      getAddress: Addressing.indirectX,
      baseCycles: 6,
    }),
    [Opcode.ADD_WITH_CARRY_INDIRECT_Y]: new AddWithCarryInstruction({
      getAddress: Addressing.indirectY,
      baseCycles: 5,
      extraCycleOnPageCross: true,
    }),

    // Subtract with Carry
    [Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE]: new SubtractWithCarryInstruction({
      getAddress: Addressing.immediate,
      baseCycles: 2,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_ZERO_PAGE]: new SubtractWithCarryInstruction({
      getAddress: Addressing.zeroPage,
      baseCycles: 3,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_ZERO_PAGE_X]: new SubtractWithCarryInstruction({
      getAddress: Addressing.zeroPageX,
      baseCycles: 4,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE]: new SubtractWithCarryInstruction({
      getAddress: Addressing.absolute,
      baseCycles: 4,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE_X]: new SubtractWithCarryInstruction({
      getAddress: Addressing.absoluteX,
      baseCycles: 4,
      extraCycleOnPageCross: true,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE_Y]: new SubtractWithCarryInstruction({
      getAddress: Addressing.absoluteY,
      baseCycles: 4,
      extraCycleOnPageCross: true,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_INDIRECT_X]: new SubtractWithCarryInstruction({
      getAddress: Addressing.indirectX,
      baseCycles: 6,
    }),
    [Opcode.SUBTRACT_WITH_CARRY_INDIRECT_Y]: new SubtractWithCarryInstruction({
      getAddress: Addressing.indirectY,
      baseCycles: 5,
      extraCycleOnPageCross: true,
    }),
  };
