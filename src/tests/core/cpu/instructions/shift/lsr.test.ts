import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("LSR instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("LSR accumulator shifts right and updates flags (2 cycles)", () => {
    cpu.registers.A = 0x04;
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR]);

    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Carry + Zero
    cpu.registers.A = 0x01;
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR], 0x8001);

    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative sempre false
    cpu.registers.A = 0x80;
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR], 0x8002);

    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x40);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("LSR zero page shifts memory correctly (5 cycles)", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x08);
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE, addr]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);

    expect(cpu.memory.read(addr)).toBe(0x04);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("LSR zero page sets carry and zero (5 cycles)", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x01);
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE, addr], 0x8001);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("LSR absolute shifts memory correctly (6 cycles)", () => {
    const addr = 0x1234;

    cpu.memory.write(addr, 0x10);
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ABSOLUTE, 0x34, 0x12]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);

    expect(cpu.memory.read(addr)).toBe(0x08);
  });

  it("LSR zero page,X uses X offset (6 cycles)", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;

    cpu.memory.write(base + 0x05, 0x06);
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE_X, base]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);

    expect(cpu.memory.read(base + 0x05)).toBe(0x03);
  });

  it("LSR absolute,X uses X offset (7 cycles)", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;

    cpu.memory.write(base + 0x02, 0x08);
    cpu.loadProgram([Opcode.LOGICAL_SHIFT_RIGHT_ABSOLUTE_X, 0x00, 0x20]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(7);

    expect(cpu.memory.read(base + 0x02)).toBe(0x04);
  });
});
