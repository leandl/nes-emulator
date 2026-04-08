import { Opcode, TransferOpcode } from "../../opcode";
import { CPURegister } from "../../registers";
import { Instruction } from "../../instructions/instruction";
import { TransferInstruction } from "../../instructions/transfer-instruction";

export const allTransferInstructions: Record<TransferOpcode, Instruction> = {
  // X Register <-> Accumulator
  [Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER]: new TransferInstruction({
    source: CPURegister.ACCUMULATOR,
    destination: CPURegister.X,
  }),
  [Opcode.TRANSFER_X_REGISTER_TO_ACCUMULATOR]: new TransferInstruction({
    source: CPURegister.X,
    destination: CPURegister.ACCUMULATOR,
  }),

  // Y Register <-> Accumulator
  [Opcode.TRANSFER_ACCUMULATOR_TO_Y_REGISTER]: new TransferInstruction({
    source: CPURegister.ACCUMULATOR,
    destination: CPURegister.Y,
  }),
  [Opcode.TRANSFER_Y_REGISTER_TO_ACCUMULATOR]: new TransferInstruction({
    source: CPURegister.Y,
    destination: CPURegister.ACCUMULATOR,
  }),
};
