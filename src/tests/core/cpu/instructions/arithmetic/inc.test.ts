import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("INC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  // --- Zero Page ---
  it("INC Zero Page increments memory and updates flags", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x10);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("INC Zero Page sets ZERO flag", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0xff);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("INC Zero Page sets NEGATIVE flag", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x7f);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("INC Zero Page does not affect CARRY or OVERFLOW", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  // --- Zero Page,X ---
  it("INC Zero Page,X increments memory and updates flags", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x10);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Zero Page,X sets ZERO flag", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0xff);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Zero Page,X sets NEGATIVE flag", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x7f);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Zero Page,X does not affect CARRY or OVERFLOW", () => {
    const addr = 0x10;
    cpu.registers.X = 2;
    cpu.memory.write(addr + 2, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 2)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  // --- Absolute ---
  it("INC Absolute increments memory and updates flags", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x10);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Absolute sets ZERO flag", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0xff);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Absolute sets NEGATIVE flag", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x7f);
    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Absolute does not affect CARRY or OVERFLOW", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  // --- Absolute,X ---
  it("INC Absolute,X increments memory and updates flags", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x10);
    cpu.loadProgram([
      Opcode.INCREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("INC Absolute,X sets ZERO flag", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0xff);
    cpu.loadProgram([
      Opcode.INCREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("INC Absolute,X sets NEGATIVE flag", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x7f);
    cpu.loadProgram([
      Opcode.INCREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("INC Absolute,X does not affect CARRY or OVERFLOW", () => {
    const addr = 0x1230;
    cpu.registers.X = 4;
    cpu.memory.write(addr + 4, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([
      Opcode.INCREMENT_MEMORY_ABSOLUTE_X,
      addr & 0xff,
      addr >> 8,
    ]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr + 4)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(7);
  });
});
