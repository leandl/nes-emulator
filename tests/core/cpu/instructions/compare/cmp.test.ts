import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("CMP instruction integration tests", () => {
  let cpu: CPU;

  it("CMP immediate sets flags correctly, consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_IMMEDIATE, 0x40]));
    cpu.registers.A = 0x50;

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x50); // não altera A
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true); // 0x50 >= 0x40
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_IMMEDIATE, 0x50]));
    cpu.registers.A = 0x50;
    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_IMMEDIATE, 0x60]));
    cpu.registers.A = 0x50;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true); // 0x50 - 0x60 = negativo (wrap)
  });

  it("CMP zero page, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0x30;
    cpu.write(0x0010, 0x10);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("CMP zero page X, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_ACCUMULATOR_ZERO_PAGE_X, 0x10]),
    );

    cpu.registers.A = 0x30;
    cpu.registers.X = 0x05;

    cpu.write(0x0015, 0x40);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("CMP absolute, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_ACCUMULATOR_ABSOLUTE, 0x00, 0x10]),
    );

    cpu.registers.A = 0x80;
    cpu.write(0x1000, 0x80);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("CMP absolute X, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_ACCUMULATOR_ABSOLUTE_X, 0x00, 0x10]),
    );

    cpu.registers.A = 0x10;
    cpu.registers.X = 0x01;

    cpu.write(0x1001, 0x20);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("CMP absolute X adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_ACCUMULATOR_ABSOLUTE_X, 0xff, 0x10]),
    );

    cpu.registers.A = 0xff;
    cpu.registers.X = 0x01;

    cpu.write(0x1100, 0x01);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("CMP absolute Y, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_ACCUMULATOR_ABSOLUTE_Y, 0x00, 0x10]),
    );

    cpu.registers.A = 0x30;
    cpu.registers.Y = 0x02;

    cpu.write(0x1002, 0x10);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true); // 0x30 >= 0x10
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("CMP absolute Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_ACCUMULATOR_ABSOLUTE_Y, 0xff, 0x10]),
    );

    cpu.registers.A = 0x10;
    cpu.registers.Y = 0x01;

    // 0x10FF + 0x01 = 0x1100
    cpu.write(0x1100, 0x20);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false); // 0x10 < 0x10
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("CMP (indirect,X), consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_INDIRECT_X, 0x10]));

    cpu.registers.A = 0x50;
    cpu.registers.X = 0x04;

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0x40);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("CMP (indirect),Y, consumes 5 cycles (+1 if page crossed)", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_INDIRECT_Y, 0x10]));

    cpu.registers.A = 0x50;
    cpu.registers.Y = 0x01;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x40);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("CMP (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_INDIRECT_Y, 0x10]));

    cpu.registers.A = 0x50;
    cpu.registers.Y = 0x01;

    cpu.write(0x10, 0xff);
    cpu.write(0x11, 0x10);
    cpu.write(0x1100, 0x40);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });

  it("CMP negative flag uses bit 7 of result (wrap behavior)", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_ACCUMULATOR_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0x00;
    cpu.write(0x0010, 0x01);

    cpu.step();

    // 0x00 - 0x01 = 0xFF → bit 7 = 1
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
  });
});
