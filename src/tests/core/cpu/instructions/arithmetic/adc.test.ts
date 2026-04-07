import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ADC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ADC adds value to accumulator (no carry)", () => {
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x15);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ADC includes carry flag in addition", () => {
    cpu.registers.A = 0x10;
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x16);
  });

  it("ADC sets ZERO flag", () => {
    cpu.registers.A = 0x00;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x00]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
  });

  it("ADC sets NEGATIVE flag", () => {
    cpu.registers.A = 0x40;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x40]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ADC sets CARRY on unsigned overflow", () => {
    cpu.registers.A = 0xff;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x01]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
  });

  it("ADC sets OVERFLOW when positive + positive = negative", () => {
    cpu.registers.A = 0x50; // +80

    cpu.loadProgram([
      Opcode.ADD_WITH_CARRY_IMMEDIATE,
      0x50, // +80
    ]);

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0); // negativo
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ADC sets OVERFLOW when negative + negative = positive", () => {
    cpu.registers.A = 0x90; // negativo

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x90]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x20);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
  });

  it("ADC does not set OVERFLOW when signs differ", () => {
    cpu.registers.A = 0x50;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x90]);

    cpu.step();

    expect(cpu.status.is(Flag.OVERFLOW)).toBe(false);
  });
});
