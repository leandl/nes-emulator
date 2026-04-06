import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("SBC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("SBC subtracts memory from accumulator (no borrow)", () => {
    cpu.registers.A = 0x10;
    cpu.status.setFlag(Flag.CARRY, true); // sem borrow

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x0b);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("SBC includes borrow when carry is clear", () => {
    cpu.registers.A = 0x10;
    cpu.status.setFlag(Flag.CARRY, false); // com borrow

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x0a); // 0x10 - 0x05 - 1
  });

  it("SBC wraps underflow (0x00 - 0x01)", () => {
    cpu.registers.A = 0x00;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.status.is(Flag.CARRY)).toBe(false); // houve borrow
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("SBC sets ZERO flag", () => {
    cpu.registers.A = 0x05;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
  });

  it("SBC sets NEGATIVE flag", () => {
    cpu.registers.A = 0x01;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x02]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("SBC sets OVERFLOW when positive - negative = negative", () => {
    cpu.registers.A = 0x50; // positivo
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([
      Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE,
      0xb0, // negativo
    ]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
  });

  it("SBC sets OVERFLOW when negative - positive = positive", () => {
    cpu.registers.A = 0x90; // negativo
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([
      Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE,
      0x10, // positivo
    ]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC does not set OVERFLOW when signs behave correctly", () => {
    cpu.registers.A = 0x50;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x10]);

    cpu.step();

    expect(cpu.status.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC keeps CARRY set when no borrow occurs", () => {
    cpu.registers.A = 0x20;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x10]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x10);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
  });

  it("SBC clears CARRY when borrow occurs", () => {
    cpu.registers.A = 0x10;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x20]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xf0);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
  });

  it("SBC sets ZERO and keeps CARRY when result is exact zero", () => {
    cpu.registers.A = 0x01;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
  });

  it("SBC sets NEGATIVE and clears CARRY on underflow", () => {
    cpu.registers.A = 0x00;
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x02]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xfe);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
  });

  it("SBC sets OVERFLOW when negative - negative = positive", () => {
    cpu.registers.A = 0x90; // negativo
    cpu.status.setFlag(Flag.CARRY, true);

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0xf0]); // negativo

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0); // positiv
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC sets multiple flags correctly in complex case", () => {
    cpu.registers.A = 0x80; // negativo
    cpu.status.setFlag(Flag.CARRY, false); // força borrow

    loadProgram([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x7e);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
  });
});
