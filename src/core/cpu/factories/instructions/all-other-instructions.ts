import { Opcode, OtherOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { NoOperationInstruction } from "../../instructions/no-operation-instruction";

export const allOtherInstructions: Record<OtherOpcode, Instruction> = {
  // System
  [Opcode.NO_OPERATION]: new NoOperationInstruction(),
};
