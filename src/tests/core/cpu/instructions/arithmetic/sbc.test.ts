import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("SBC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("SBC immediate (2 cycles)", () => {
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x0b);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC zero page (3 cycles)", () => {
    cpu.memory.write(0x10, 0x05);
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(3);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC zero page,X (4 cycles)", () => {
    cpu.registers.X = 0x01;
    cpu.memory.write(0x11, 0x05);
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_ZERO_PAGE_X, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC absolute (4 cycles)", () => {
    cpu.memory.write(0x1234, 0x05);
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE, 0x34, 0x12]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC absolute,X without page cross (4 cycles)", () => {
    cpu.registers.X = 0x01;
    cpu.memory.write(0x2001, 0x05);
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE_X, 0x00, 0x20]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC absolute,X with page cross (5 cycles)", () => {
    cpu.registers.X = 0x01;
    cpu.memory.write(0x2100, 0x05);
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_ABSOLUTE_X, 0xff, 0x20]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC (indirect,X) (6 cycles)", () => {
    cpu.registers.X = 0x04;

    cpu.memory.write(0x14, 0x00);
    cpu.memory.write(0x15, 0x30);

    cpu.memory.write(0x3000, 0x05);

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_INDIRECT_X, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC (indirect),Y without page cross (5 cycles)", () => {
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x10, 0x00);
    cpu.memory.write(0x11, 0x20);

    cpu.memory.write(0x2001, 0x05);

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_INDIRECT_Y, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC (indirect),Y with page cross (6 cycles)", () => {
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x10, 0xff);
    cpu.memory.write(0x11, 0x20);

    cpu.memory.write(0x2100, 0x05);

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_INDIRECT_Y, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("SBC subtracts memory from accumulator (no borrow)", () => {
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true); // sem borrow

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x0b);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("SBC includes borrow when carry is clear", () => {
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false); // com borrow

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x0a); // 0x10 - 0x05 - 1
  });

  it("SBC wraps underflow (0x00 - 0x01)", () => {
    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false); // houve borrow
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("SBC sets ZERO flag", () => {
    cpu.registers.A = 0x05;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC sets NEGATIVE flag", () => {
    cpu.registers.A = 0x01;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x02]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("SBC sets OVERFLOW when positive - negative = negative", () => {
    cpu.registers.A = 0x50; // positivo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([
      Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE,
      0xb0, // negativo
    ]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });

  it("SBC sets OVERFLOW when negative - positive = positive", () => {
    cpu.registers.A = 0x90; // negativo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([
      Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE,
      0x10, // positivo
    ]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC does not set OVERFLOW when signs behave correctly", () => {
    cpu.registers.A = 0x50;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x10]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC keeps CARRY set when no borrow occurs", () => {
    cpu.registers.A = 0x20;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x10]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x10);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC clears CARRY when borrow occurs", () => {
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x20]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xf0);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
  });

  it("SBC sets ZERO and keeps CARRY when result is exact zero", () => {
    cpu.registers.A = 0x01;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC sets NEGATIVE and clears CARRY on underflow", () => {
    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x02]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xfe);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
  });

  it("SBC sets OVERFLOW when negative - negative = positive", () => {
    cpu.registers.A = 0x90; // negativo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0xf0]); // negativo

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0); // positiv
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC sets multiple flags correctly in complex case", () => {
    cpu.registers.A = 0x80; // negativo
    cpu.registers.STATUS.setFlag(Flag.CARRY, false); // força borrow

    cpu.loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x7e);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });
});
