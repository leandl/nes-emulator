import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("JMP instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("JMP absolute sets PC correctly, consumes 3 cycles", () => {
    cpu.loadProgram([Opcode.JUMP_ABSOLUTE, 0x00, 0x20]); // JMP $2000
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(0x2000);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("JMP indirect sets PC correctly, consumes 5 cycles", () => {
    cpu.loadProgram([Opcode.JUMP_INDIRECT, 0x00, 0x30]); // JMP ($3000)

    // endereço indireto aponta para 0x4000
    cpu.memory.write(0x3000, 0x00); // low
    cpu.memory.write(0x3001, 0x40); // high

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(0x4000);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("JMP indirect emulates page boundary bug ($xxFF)", () => {
    cpu.loadProgram([Opcode.JUMP_INDIRECT, 0xff, 0x03]); // JMP ($03FF)

    // comportamento bugado:
    // low byte vem de 0x03FF
    // high byte vem de 0x0300 (não 0x0400)
    cpu.memory.write(0x03ff, 0x00); // low
    cpu.memory.write(0x0300, 0x80); // high errado por causa do bug

    const initialCycles = cpu.cycles;

    cpu.step();

    // endereço esperado: 0x8000 (0x80 << 8 | 0x00)
    expect(cpu.registers.PC).toBe(0x8000);
    expect(cpu.cycles - initialCycles).toBe(5);
  });
});
