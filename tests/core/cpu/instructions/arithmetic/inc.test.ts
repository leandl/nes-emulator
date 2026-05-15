import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("INC instruction integration tests", () => {
  let cpu: CPU;

  // --- Zero Page ---
  it("INC Zero Page increments memory and updates flags", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]));

    cpu.write(addr, 0x10);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("INC Zero Page sets ZERO flag", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]));

    cpu.write(addr, 0xff);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("INC Zero Page sets NEGATIVE flag", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]));

    cpu.write(addr, 0x7f);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("INC Zero Page does not affect CARRY or OVERFLOW", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]));

    cpu.write(addr, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  // --- Zero Page,X ---
  it("INC Zero Page,X increments memory and updates flags", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]));

    cpu.registers.X = 2;
    cpu.write(addr + 2, 0x10);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 2)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Zero Page,X sets ZERO flag", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]));

    cpu.registers.X = 2;
    cpu.write(addr + 2, 0xff);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 2)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Zero Page,X sets NEGATIVE flag", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]));

    cpu.registers.X = 2;
    cpu.write(addr + 2, 0x7f);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 2)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Zero Page,X does not affect CARRY or OVERFLOW", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.INCREMENT_MEMORY_ZERO_PAGE_X, addr]));

    cpu.registers.X = 2;
    cpu.write(addr + 2, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 2)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  // --- Absolute ---
  it("INC Absolute increments memory and updates flags", () => {
    const addr = 0x1234;
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]),
    );

    cpu.write(addr, 0x10);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Absolute sets ZERO flag", () => {
    const addr = 0x1234;
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]),
    );

    cpu.write(addr, 0xff);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Absolute sets NEGATIVE flag", () => {
    const addr = 0x1234;
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]),
    );

    cpu.write(addr, 0x7f);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("INC Absolute does not affect CARRY or OVERFLOW", () => {
    const addr = 0x1234;

    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE, addr & 0xff, addr >> 8]),
    );

    cpu.write(addr, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  // --- Absolute,X ---
  it("INC Absolute,X increments memory and updates flags", () => {
    const addr = 0x1230;

    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE_X, addr & 0xff, addr >> 8]),
    );

    cpu.registers.X = 4;
    cpu.write(addr + 4, 0x10);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 4)).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("INC Absolute,X sets ZERO flag", () => {
    const addr = 0x1230;

    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE_X, addr & 0xff, addr >> 8]),
    );

    cpu.registers.X = 4;
    cpu.write(addr + 4, 0xff);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 4)).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("INC Absolute,X sets NEGATIVE flag", () => {
    const addr = 0x1230;

    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE_X, addr & 0xff, addr >> 8]),
    );

    cpu.registers.X = 4;
    cpu.write(addr + 4, 0x7f);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 4)).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("INC Absolute,X does not affect CARRY or OVERFLOW", () => {
    const addr = 0x1230;

    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_MEMORY_ABSOLUTE_X, addr & 0xff, addr >> 8]),
    );

    cpu.registers.X = 4;
    cpu.write(addr + 4, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr + 4)).toBe(0x02);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(7);
  });
});
