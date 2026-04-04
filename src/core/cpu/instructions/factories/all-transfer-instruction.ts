import { Opcode, TransferOpcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { Instruction } from "../instruction";
import { TransferInstruction } from "../transfer-instruction";

export const allTransferInstructions: Record<TransferOpcode, Instruction> = {
  // X Register <-> Accumulator
  [Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER]: new TransferInstruction(
    CPURegister.ACCUMULATOR,
    CPURegister.X,
  ),
  [Opcode.TRANSFER_X_REGISTER_TO_ACCUMULATOR]: new TransferInstruction(
    CPURegister.X,
    CPURegister.ACCUMULATOR,
  ),

  // Y Register <-> Accumulator
  [Opcode.TRANSFER_ACCUMULATOR_TO_Y_REGISTER]: new TransferInstruction(
    CPURegister.ACCUMULATOR,
    CPURegister.Y,
  ),
  [Opcode.TRANSFER_Y_REGISTER_TO_ACCUMULATOR]: new TransferInstruction(
    CPURegister.Y,
    CPURegister.ACCUMULATOR,
  ),
};
