import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("DEC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  // --- Zero Page ---
  it("DEC Zero Page decrements memory and updates flags", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x10);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("DEC Zero Page sets ZERO flag", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x01);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("DEC Zero Page sets NEGATIVE flag", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x00);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("DEC Zero Page does not affect CARRY or OVERFLOW", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x05);
    cpu.status.setFlag(Flag.CARRY, true);
    cpu.status.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x04);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("DEC Zero Page wraps from 0x00 to 0xFF (underflow)", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x00);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  // --- Zero Page,X ---
  it("DEC Zero Page,X decrements memory and updates flags", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x10);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DEC Zero Page,X sets ZERO flag", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x01);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DEC Zero Page,X sets NEGATIVE flag", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x00);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DEC Zero Page,X does not affect CARRY or OVERFLOW", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x05);
    cpu.status.setFlag(Flag.CARRY, true);
    cpu.status.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x04);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  // --- Absolute ---
  it("DEC Absolute decrements memory and updates flags", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x10);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DEC Absolute sets ZERO flag", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x01);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DEC Absolute sets NEGATIVE flag", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x00);
    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DEC Absolute does not affect CARRY or OVERFLOW", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x05);
    cpu.status.setFlag(Flag.CARRY, true);
    cpu.status.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.DECREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x04);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  // --- Absolute,X ---
  it("DEC Absolute,X decrements memory and updates flags", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x10);
    cpu.loadProgram([
      Opcode.DECREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("DEC Absolute,X sets ZERO flag", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x01);
    cpu.loadProgram([
      Opcode.DECREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("DEC Absolute,X sets NEGATIVE flag", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x00);
    cpu.loadProgram([
      Opcode.DECREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("DEC Absolute,X does not affect CARRY or OVERFLOW", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x05);
    cpu.status.setFlag(Flag.CARRY, true);
    cpu.status.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([
      Opcode.DECREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x04);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(7);
  });
});
