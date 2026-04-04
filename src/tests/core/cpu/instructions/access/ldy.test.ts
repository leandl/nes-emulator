import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("LDY instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("LDY immediate loads Y and sets flags", () => {
    // Valor normal
    loadProgram([Opcode.LOAD_Y_REGISTER_IMMEDIATE, 0x42]);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x42);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Zero flag
    loadProgram([Opcode.LOAD_Y_REGISTER_IMMEDIATE, 0x00], 0x8002);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative flag
    loadProgram([Opcode.LOAD_Y_REGISTER_IMMEDIATE, 0x80], 0x8004);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("LDY zero page loads Y", () => {
    cpu.memory.write(0x0010, 0x55);
    loadProgram([Opcode.LOAD_Y_REGISTER_ZERO_PAGE, 0x10]);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x55);
  });

  it("LDY zero page X loads Y with X offset", () => {
    cpu.registers.X = 0x05;
    cpu.memory.write(0x0015, 0x77);
    loadProgram([Opcode.LOAD_Y_REGISTER_ZERO_PAGE_X, 0x10]);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x77);
  });

  it("LDY absolute loads Y", () => {
    cpu.memory.write(0x2000, 0x99);
    loadProgram([Opcode.LOAD_Y_REGISTER_ABSOLUTE, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x99);
  });

  it("LDY absolute X loads Y", () => {
    cpu.registers.X = 0x02;
    cpu.memory.write(0x2002, 0x88);
    loadProgram([Opcode.LOAD_Y_REGISTER_ABSOLUTE_X, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x88);
  });
});
