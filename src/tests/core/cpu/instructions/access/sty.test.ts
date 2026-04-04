import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("STY instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("STY zero page stores Y", () => {
    cpu.registers.Y = 0x42;
    loadProgram([Opcode.STORE_Y_REGISTER_ZERO_PAGE, 0x10]);
    cpu.step();
    expect(cpu.memory.read(0x0010)).toBe(0x42);
  });

  it("STY zero page X stores Y with X offset", () => {
    cpu.registers.Y = 0x55;
    cpu.registers.X = 0x05;
    loadProgram([Opcode.STORE_Y_REGISTER_ZERO_PAGE_X, 0x10]);
    cpu.step();
    expect(cpu.memory.read(0x0015)).toBe(0x55);
  });

  it("STY absolute stores Y", () => {
    cpu.registers.Y = 0x77;
    loadProgram([Opcode.STORE_Y_REGISTER_ABSOLUTE, 0x00, 0x20]);
    cpu.step();
    expect(cpu.memory.read(0x2000)).toBe(0x77);
  });
});
