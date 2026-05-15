import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("SLO instruction integration tests", () => {
  let cpu: CPU;

  it("SLO zero page applies ASL then ORA, sets flags, consumes 5 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0b00001111;
    cpu.write(0x10, 0b10000000); // bit7 = 1

    const initialCycles = cpu.cycles;
    cpu.step();

    // memória foi shiftada
    expect(cpu.read(0x10)).toBe(0b00000000);

    // A OR com valor shiftado
    expect(cpu.registers.A).toBe(0b00001111);

    // carry vem do bit 7 original
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("SLO zero page sets ZERO and NEGATIVE correctly", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x00;
    cpu.write(0x10, 0x00);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("SLO zero page,X consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE_X,
        0x10,
      ]),
    );

    cpu.registers.X = 0x01;
    cpu.registers.A = 0x00;

    cpu.write(0x11, 0b01000000);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x11)).toBe(0b10000000);
    expect(cpu.registers.A).toBe(0b10000000);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("SLO absolute consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ABSOLUTE,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.A = 0x01;
    cpu.write(0x1000, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x04);
    expect(cpu.registers.A).toBe(0x05);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("SLO absolute,X consumes 7 cycles (no page crossing extra)", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ABSOLUTE_X,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.X = 0x01;
    cpu.registers.A = 0x00;

    cpu.write(0x1001, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("SLO absolute,Y consumes 7 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ABSOLUTE_Y,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.Y = 0x01;
    cpu.registers.A = 0x00;

    cpu.write(0x1001, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("SLO (indirect,X) consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_INDIRECT_X, 0x10]),
    );

    cpu.registers.X = 0x04;
    cpu.registers.A = 0x00;

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(8);
  });

  it("SLO (indirect),Y consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_INDIRECT_Y, 0x10]),
    );

    cpu.registers.Y = 0x01;
    cpu.registers.A = 0x00;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(8);
  });

  it("SLO sets carry from bit 7", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x00;
    cpu.write(0x10, 0b10000000);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SLO clears carry when bit 7 is 0", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SHIFT_LEFT_AND_OR_WITH_ACCUMULATOR_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x00;
    cpu.write(0x10, 0b01000000);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
  });
});
