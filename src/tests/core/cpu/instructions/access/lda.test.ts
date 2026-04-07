import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("LDA instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("LDA immediate loads accumulator and sets flags correctly", () => {
    // Valor normal
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x42]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Zero flag
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x00]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative flag
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x80]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("LDA zero page loads accumulator", () => {
    cpu.memory.write(0x0010, 0x55);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ZERO_PAGE, 0x10]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x55);
  });

  it("LDA zero page X loads accumulator with X offset", () => {
    cpu.registers.X = 0x05;
    cpu.memory.write(0x0015, 0x77);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ZERO_PAGE_X, 0x10]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x77);
  });

  it("LDA absolute loads accumulator", () => {
    cpu.memory.write(0x2000, 0x99);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x99);
  });

  it("LDA absolute X loads accumulator", () => {
    cpu.registers.X = 0x03;
    cpu.memory.write(0x2003, 0x88);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x88);
  });

  it("LDA absolute Y loads accumulator", () => {
    cpu.registers.Y = 0x02;
    cpu.memory.write(0x2002, 0x77);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x77);
  });

  it("LDA (indirect,X) loads accumulator", () => {
    cpu.registers.X = 0x04;
    cpu.memory.write(0x14, 0x00); // low
    cpu.memory.write(0x15, 0x20); // high
    cpu.memory.write(0x2000, 0x66); // valor final
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_INDIRECT_X, 0x10]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x66);
  });

  it("LDA (indirect),Y loads accumulator", () => {
    cpu.registers.Y = 0x01;
    cpu.memory.write(0x10, 0x00); // low
    cpu.memory.write(0x11, 0x20); // high
    cpu.memory.write(0x2001, 0x55); // valor final
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_INDIRECT_Y, 0x10]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x55);
  });
});
