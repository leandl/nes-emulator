import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("DCP instruction integration tests", () => {
  let cpu: CPU;

  it("DCP zero page decrements memory and compares with A", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x50;
    cpu.write(0x0010, 0x40);

    const initialCycles = cpu.cycles;

    cpu.step();

    // memória foi decrementada
    expect(cpu.read(0x0010)).toBe(0x3f);

    // comparação: 0x50 >= 0x3f
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("DCP sets ZERO when A == memory after decrement", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x3f;
    cpu.write(0x0010, 0x40);

    cpu.step();

    expect(cpu.read(0x0010)).toBe(0x3f);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("DCP sets NEGATIVE correctly (wrap behavior)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x00;
    cpu.write(0x0010, 0x01);

    cpu.step();

    // memória: 0x01 -> 0x00
    expect(cpu.read(0x0010)).toBe(0x00);

    // 0x00 - 0x00 = 0x00
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("DCP sets NEGATIVE when result wraps", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x00;
    cpu.write(0x0010, 0x02);

    cpu.step();

    // memória: 0x02 -> 0x01
    expect(cpu.read(0x0010)).toBe(0x01);

    // 0x00 - 0x01 = 0xFF (negativo)
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("DCP zero page X, consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ZERO_PAGE_X, 0x10]),
    );

    cpu.registers.A = 0x20;
    cpu.registers.X = 0x05;

    cpu.write(0x0015, 0x10);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(0x0015)).toBe(0x0f);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DCP absolute, consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ABSOLUTE,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.A = 0x10;
    cpu.write(0x1000, 0x11);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x10);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("DCP absolute X, consumes 7 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ABSOLUTE_X,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.A = 0x20;
    cpu.registers.X = 0x01;

    cpu.write(0x1001, 0x30);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x2f);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);

    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("DCP absolute Y, consumes 7 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_ABSOLUTE_Y,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.A = 0x50;
    cpu.registers.Y = 0x02;

    cpu.write(0x1002, 0x40);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(0x1002)).toBe(0x3f);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("DCP (indirect,X), consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_INDIRECT_X, 0x10]),
    );

    cpu.registers.A = 0x50;
    cpu.registers.X = 0x04;

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0x60);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x5f);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);

    expect(cpu.cycles - initialCycles).toBe(8);
  });

  it("DCP (indirect),Y, consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.DECREMENT_AND_COMPARE_ACCUMULATOR_INDIRECT_Y, 0x10]),
    );

    cpu.registers.A = 0x80;
    cpu.registers.Y = 0x01;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x70);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x6f);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(8);
  });
});
