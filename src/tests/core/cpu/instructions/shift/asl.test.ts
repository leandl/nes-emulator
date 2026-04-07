import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ASL instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ASL accumulator shifts left and updates flags", () => {
    // Caso normal
    cpu.registers.A = 0x21; // 0010 0001 -> 0100 0010
    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR]);
    cpu.step();

    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Carry + Zero
    cpu.registers.A = 0x80; // 1000 0000 -> 0000 0000
    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR], 0x8001);
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative
    cpu.registers.A = 0x40; // 0100 0000 -> 1000 0000
    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR], 0x8002);
    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ASL zero page shifts memory correctly", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x01); // -> 0x02
    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x02);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ASL zero page sets carry and zero", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x80); // -> 0x00
    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE, addr], 0x8001);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ASL absolute shifts memory correctly", () => {
    const addr = 0x1234;

    cpu.memory.write(addr, 0x02); // -> 0x04
    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ABSOLUTE, 0x34, 0x12]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x04);
  });

  it("ASL zero page,X uses X offset", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;

    cpu.memory.write(base + 0x05, 0x03); // -> 0x06

    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE_X, base]);

    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x06);
  });

  it("ASL absolute,X uses X offset", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;

    cpu.memory.write(base + 0x02, 0x04); // -> 0x08

    cpu.loadProgram([Opcode.ARITHMETIC_SHIFT_LEFT_ABSOLUTE_X, 0x00, 0x20]);

    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x08);
  });
});
