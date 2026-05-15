import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("LSR instruction integration tests", () => {
  let cpu: CPU;

  it("LSR accumulator shifts right and updates flags (2 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR]));
    cpu.registers.A = 0x04;

    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    // Carry + Zero
    cpu = createCPU(
      new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR], 0x8001),
    );
    cpu.registers.A = 0x01;

    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    // Negative sempre false
    cpu = createCPU(
      new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ACCUMULATOR], 0x8002),
    );
    cpu.registers.A = 0x80;

    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x40);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("LSR zero page shifts memory correctly (5 cycles)", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE, addr]));
    cpu.write(addr, 0x08);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);

    expect(cpu.read(addr)).toBe(0x04);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("LSR zero page sets carry and zero (5 cycles)", () => {
    const addr = 0x10;

    cpu = createCPU(
      new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE, addr], 0x8001),
    );
    cpu.write(addr, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);

    expect(cpu.read(addr)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("LSR absolute shifts memory correctly (6 cycles)", () => {
    const addr = 0x1234;

    cpu = createCPU(
      new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ABSOLUTE, 0x34, 0x12]),
    );
    cpu.write(addr, 0x10);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);

    expect(cpu.read(addr)).toBe(0x08);
  });

  it("LSR zero page,X uses X offset (6 cycles)", () => {
    const base = 0x10;

    cpu = createCPU(
      new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ZERO_PAGE_X, base]),
    );

    cpu.write(base + 0x05, 0x06);
    cpu.registers.X = 0x05;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);

    expect(cpu.read(base + 0x05)).toBe(0x03);
  });

  it("LSR absolute,X uses X offset (7 cycles)", () => {
    const base = 0x0100;

    cpu = createCPU(
      new FakeRom([Opcode.LOGICAL_SHIFT_RIGHT_ABSOLUTE_X, 0x00, 0x01]),
    );

    cpu.registers.X = 0x02;
    cpu.write(base + 0x02, 0x08);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(7);

    expect(cpu.read(base + 0x02)).toBe(0x04);
  });
});
