import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("LDX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("LDX immediate loads X and sets flags", () => {
    // Valor normal
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_IMMEDIATE, 0x42]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Zero flag
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_IMMEDIATE, 0x00], 0x8002);
    cpu.step();
    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative flag
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_IMMEDIATE, 0x80], 0x8004);
    cpu.step();
    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("LDX zero page loads X", () => {
    cpu.memory.write(0x0010, 0x55);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ZERO_PAGE, 0x10]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x55);
  });

  it("LDX zero page Y loads X with Y offset", () => {
    cpu.registers.Y = 0x05;
    cpu.memory.write(0x0015, 0x77);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ZERO_PAGE_Y, 0x10]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x77);
  });

  it("LDX absolute loads X", () => {
    cpu.memory.write(0x2000, 0x99);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ABSOLUTE, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x99);
  });

  it("LDX absolute Y loads X", () => {
    cpu.registers.Y = 0x02;
    cpu.memory.write(0x2002, 0x88);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ABSOLUTE_Y, 0x00, 0x20]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x88);
  });
});
