import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("ASL instruction integration tests", () => {
  let cpu: CPU;

  it("ASL accumulator shifts left and updates flags (2 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR]));
    cpu.registers.A = 0x21;

    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    // Carry + Zero
    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR], 0x8001),
    );
    cpu.registers.A = 0x80;

    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    // Negative
    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ACCUMULATOR], 0x8002),
    );
    cpu.registers.A = 0x40;

    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ASL zero page shifts memory correctly (5 cycles)", () => {
    const addr = 0x10;

    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE, addr]),
    );
    cpu.write(addr, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);

    expect(cpu.read(addr)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ASL zero page sets carry and zero (5 cycles)", () => {
    const addr = 0x10;

    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE, addr], 0x8001),
    );
    cpu.write(addr, 0x80);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);

    expect(cpu.read(addr)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ASL absolute shifts memory correctly (6 cycles)", () => {
    const addr = 0x1234;

    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ABSOLUTE, 0x34, 0x12]),
    );
    cpu.write(addr, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);

    expect(cpu.read(addr)).toBe(0x04);
  });

  it("ASL zero page,X uses X offset (6 cycles)", () => {
    const base = 0x10;

    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ZERO_PAGE_X, base]),
    );

    cpu.registers.X = 0x05;
    cpu.write(base + 0x05, 0x03);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);

    expect(cpu.read(base + 0x05)).toBe(0x06);
  });

  it("ASL absolute,X uses X offset (7 cycles)", () => {
    const base = 0x0100;

    cpu = createCPU(
      new FakeRom([Opcode.ARITHMETIC_SHIFT_LEFT_ABSOLUTE_X, 0x00, 0x01]),
    );

    cpu.registers.X = 0x02;
    cpu.write(base + 0x02, 0x04);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(7);

    expect(cpu.read(base + 0x02)).toBe(0x08);
  });
});
