import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("STX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("STX zero page stores X, consumes 3 cycles", () => {
    cpu.registers.X = 0x42;
    cpu.loadProgram([Opcode.STORE_X_REGISTER_ZERO_PAGE, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.memory.read(0x0010)).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("STX zero page Y stores X with Y offset, consumes 4 cycles", () => {
    cpu.registers.X = 0x55;
    cpu.registers.Y = 0x05;
    cpu.loadProgram([Opcode.STORE_X_REGISTER_ZERO_PAGE_Y, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.memory.read(0x0015)).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("STX absolute stores X, consumes 4 cycles", () => {
    cpu.registers.X = 0x77;
    cpu.loadProgram([Opcode.STORE_X_REGISTER_ABSOLUTE, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.memory.read(0x2000)).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });
});
