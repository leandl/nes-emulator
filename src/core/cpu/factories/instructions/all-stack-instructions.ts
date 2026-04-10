import { Opcode, StackOpcode } from "../../opcode";
import { Instruction } from "../../instructions/instruction";
import { StackInstruction } from "../../instructions/stack-instruction";
import { CPURegister } from "../../registers";
import { TransferInstruction } from "../../instructions/transfer-instruction";

export const allStackInstructions: Record<StackOpcode, Instruction> = {
  // Stack Accumulator
  [Opcode.STACK_PUSH_ACCUMULATOR]: new StackInstruction({
    mode: "PUSH",
    register: CPURegister.ACCUMULATOR,
  }),
  [Opcode.STACK_PULL_ACCUMULATOR]: new StackInstruction({
    mode: "PULL",
    register: CPURegister.ACCUMULATOR,
  }),

  // Stack Processor Status
  [Opcode.STACK_PUSH_PROCESSOR_STATUS]: new StackInstruction({
    mode: "PUSH",
    register: CPURegister.STATUS,
  }),
  [Opcode.STACK_PULL_PROCESSOR_STATUS]: new StackInstruction({
    mode: "PULL",
    register: CPURegister.STATUS,
  }),

  // Transfer X Register <-> Stack Pointer
  [Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER]: new TransferInstruction({
    source: CPURegister.STACK_POINTER,
    destination: CPURegister.X,
  }),
  [Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]: new TransferInstruction({
    source: CPURegister.X,
    destination: CPURegister.STACK_POINTER,
  }),
};
