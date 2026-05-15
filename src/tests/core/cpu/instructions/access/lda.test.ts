import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("LDA instruction integration tests", () => {
  let cpu: CPU;

  it("LDA immediate loads accumulator and sets flags, consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x42]));

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x00]));

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_IMMEDIATE, 0x80]));

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("LDA zero page loads accumulator, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_ZERO_PAGE, 0x10]));

    cpu.write(0x0010, 0x55);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("LDA zero page X loads accumulator with X offset, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_ZERO_PAGE_X, 0x10]));

    cpu.registers.X = 0x05;
    cpu.write(0x0015, 0x77);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute loads accumulator, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_ACCUMULATOR_ABSOLUTE, 0x00, 0x10]),
    );

    cpu.write(0x1000, 0x99);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute X loads accumulator, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X, 0x00, 0x10]),
    );

    cpu.registers.X = 0x03;
    cpu.write(0x1003, 0x88);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x88);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute X adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_X, 0xff, 0x10]),
    );

    cpu.registers.X = 0x01;

    // 0x10FF + 0x01 = 0x1100
    cpu.write(0x1100, 0x42);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("LDA absolute Y loads accumulator, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y, 0x00, 0x10]),
    );

    cpu.registers.Y = 0x02;
    cpu.write(0x1002, 0x77);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDA absolute Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.LOAD_ACCUMULATOR_ABSOLUTE_Y, 0xff, 0x10]),
    );

    cpu.registers.Y = 0x01;
    cpu.write(0x1100, 0x99);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("LDA (indirect,X) loads accumulator, consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_INDIRECT_X, 0x10]));

    cpu.registers.X = 0x04;
    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0x66);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x66);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("LDA (indirect),Y loads accumulator, consumes 5 cycles (+1 if page crossed)", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_INDIRECT_Y, 0x10]));

    cpu.registers.Y = 0x01;
    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x55);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("LDA (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(new FakeRom([Opcode.LOAD_ACCUMULATOR_INDIRECT_Y, 0x10]));

    cpu.registers.Y = 0x01;

    // ponteiro -> 0x10FF
    cpu.write(0x10, 0xff);
    cpu.write(0x11, 0x10);

    // 0x10FF + 0x01 = 0x1100
    cpu.write(0x1100, 0x77);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });
});
