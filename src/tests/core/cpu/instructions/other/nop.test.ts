import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("NOP instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("NOP does nothing except increment PC", () => {
    const initialPC = 0x8000;
    loadProgram([Opcode.NO_OPERATION], initialPC);

    // Salva estado inicial dos registradores e flags
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
  });
});
