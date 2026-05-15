import { CPU } from ".";

const STACK_BASE = 0x0100;

export class Stack {
  static push(cpu: CPU, value: number): void {
    const address = STACK_BASE + cpu.registers.SP;
    cpu.write(address, value & 0xff);
    cpu.registers.decrementSP();
  }

  static pull(cpu: CPU): number {
    cpu.registers.incrementSP();

    const address = STACK_BASE + cpu.registers.SP;
    return cpu.read(address);
  }
}
