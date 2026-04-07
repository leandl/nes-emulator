import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("NOP instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("NOP does nothing except increment PC and consume 2 cycles", () => {
    const initialPC = 0x8000;
    cpu.loadProgram([Opcode.NO_OPERATION], initialPC);

    const initialCycles = cpu.cycles;

    // Salva estado inicial
    const initialA = cpu.registers.A;
    const initialX = cpu.registers.X;
    const initialY = cpu.registers.Y;
    const initialStatus = cpu.status.raw;

    cpu.step();

    // PC deve avançar 1
    expect(cpu.registers.PC).toBe(initialPC + 1);

    // Registradores e flags não devem mudar
    expect(cpu.registers.A).toBe(initialA);
    expect(cpu.registers.X).toBe(initialX);
    expect(cpu.registers.Y).toBe(initialY);
    expect(cpu.status.raw).toBe(initialStatus);

    // ✅ ciclos
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
