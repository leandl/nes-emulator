import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("LDY instruction integration tests", () => {
  let cpu: CPU;

  it("LDY immediate loads Y and sets flags, consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_Y_REGISTER_IMMEDIATE, 0x42]));

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(
      new FakeRom([Opcode.LOAD_Y_REGISTER_IMMEDIATE, 0x00], 0x8002),
    );

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(
      new FakeRom([Opcode.LOAD_Y_REGISTER_IMMEDIATE, 0x80], 0x8004),
    );

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("LDY zero page loads Y, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_Y_REGISTER_ZERO_PAGE, 0x10]));

    cpu.write(0x0010, 0x55);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("LDY zero page X loads Y with X offset, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_Y_REGISTER_ZERO_PAGE_X, 0x10]));

    cpu.registers.X = 0x05;
    cpu.write(0x0015, 0x77);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDY absolute loads Y, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_Y_REGISTER_ABSOLUTE, 0x00, 0x11]));

    cpu.write(0x1100, 0x99);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDY absolute X loads Y, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_Y_REGISTER_ABSOLUTE_X, 0x00, 0x11]),
    );

    cpu.registers.X = 0x02;
    cpu.write(0x1102, 0x88);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x88);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDY absolute X adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_Y_REGISTER_ABSOLUTE_X, 0xff, 0x11]),
    );

    cpu.registers.X = 0x01;

    // 0x11FF + 0x01 = 0x1200 (page cross)
    cpu.write(0x1200, 0x42);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });
});
