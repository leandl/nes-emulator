import type { CPU } from "..";
import { Flag } from "../flag";
import { Stack } from "../stack";
import type { Instruction } from "./instruction";

export class BreakInstruction implements Instruction {
  execute(cpu: CPU) {
    const returnAddress = cpu.registers.PC + 1;

    // push PC
    Stack.push(cpu, (returnAddress >> 8) & 0xff);
    Stack.push(cpu, returnAddress & 0xff);

    // flags já vêm como NV1BDIZC (B=1, UNUSED=1)
    Stack.push(cpu, cpu.registers.STATUS.getForStackPush());

    // I = 1
    cpu.registers.STATUS.setFlag(Flag.INTERRUPT_DISABLE, true);

    // vetor IRQ
    const low = cpu.memory.read(0xfffe);
    const high = cpu.memory.read(0xffff);

    cpu.registers.PC = (high << 8) | low;

    return 7;
  }
}
