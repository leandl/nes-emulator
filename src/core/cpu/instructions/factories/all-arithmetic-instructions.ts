import { Opcode, ArithmeticOpcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { DecrementInstruction } from "../decrement-instruction";
import { IncrementInstruction } from "../increment-instruction";
import { Instruction } from "../instruction";

export const allArithmeticInstructions: Record<ArithmeticOpcode, Instruction> =
  {
    // Increment
    [Opcode.INCREMENT_X_REGISTER]: new IncrementInstruction(CPURegister.X),
    [Opcode.INCREMENT_Y_REGISTER]: new IncrementInstruction(CPURegister.Y),

    // Decrement
    [Opcode.DECREMENT_X_REGISTER]: new DecrementInstruction(CPURegister.X),
    [Opcode.DECREMENT_Y_REGISTER]: new DecrementInstruction(CPURegister.Y),
  };
