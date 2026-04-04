import { Opcode, OtherOpcode } from "../../opcode";
import { Instruction } from "../instruction";
import { NoOperationInstruction } from "../no-operation-instruction";

export const allOtherInstructions: Record<OtherOpcode, Instruction> = {
  // System
  [Opcode.NO_OPERATION]: new NoOperationInstruction(),
};
