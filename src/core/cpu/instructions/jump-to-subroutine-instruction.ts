import type { CPU } from "..";
import { Addressing } from "../addressing";
import { Stack } from "../stack";
import type { Instruction } from "./instruction";

export class JumpToSubroutineInstruction implements Instruction {
  execute(cpu: CPU) {
    // usa addressing padrão
    const { address: targetAddress } = Addressing.absolute(cpu);

    // PC já avançou +2 -> precisamos voltar 1
    const returnAddress = cpu.registers.PC - 1;

    Stack.push(cpu, (returnAddress >> 8) & 0xff); // push HIGH
    Stack.push(cpu, returnAddress & 0xff); // push LOW

    // jump
    cpu.registers.PC = targetAddress;

    return 6; // cycles
  }
}
