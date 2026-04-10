import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("LDA instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("LDA immediate loads accumulator and sets flags, consumes 2 cycles", () => {
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x42]);
    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x00]);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x80]);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("LDA zero page loads accumulator, consumes 3 cycles", () => {
    cpu.memory.write(0x0010, 0x55);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ZERO_PAGE, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("LDA zero page X loads accumulator with X offset, consumes 4 cycles", () => {
    cpu.registers.X = 0x05;
    cpu.memory.write(0x0015, 0x77);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ZERO_PAGE_X, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute loads accumulator, consumes 4 cycles", () => {
    cpu.memory.write(0x2000, 0x99);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute X loads accumulator, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.X = 0x03;
    cpu.memory.write(0x2003, 0x88);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x88);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute X adds 1 cycle when page is crossed", () => {
    cpu.registers.X = 0x01;

    // 0x20FF + 0x01 = 0x2100
    cpu.memory.write(0x2100, 0x42);

    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("LDA absolute Y loads accumulator, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.Y = 0x02;
    cpu.memory.write(0x2002, 0x77);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute Y adds 1 cycle when page is crossed", () => {
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x2100, 0x99);

    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("LDA (indirect,X) loads accumulator, consumes 6 cycles", () => {
    cpu.registers.X = 0x04;
    cpu.memory.write(0x14, 0x00);
    cpu.memory.write(0x15, 0x20);
    cpu.memory.write(0x2000, 0x66);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_INDIRECT_X, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x66);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("LDA (indirect),Y loads accumulator, consumes 5 cycles (+1 if page crossed)", () => {
    cpu.registers.Y = 0x01;
    cpu.memory.write(0x10, 0x00);
    cpu.memory.write(0x11, 0x20);
    cpu.memory.write(0x2001, 0x55);
    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_INDIRECT_Y, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.A).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("LDA (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu.registers.Y = 0x01;

    // ponteiro -> 0x20FF
    cpu.memory.write(0x10, 0xff);
    cpu.memory.write(0x11, 0x20);

    // 0x20FF + 0x01 = 0x2100
    cpu.memory.write(0x2100, 0x77);

    cpu.loadProgram([Opcode.LOAD_ACCUMULATOR_INDIRECT_Y, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });
});
