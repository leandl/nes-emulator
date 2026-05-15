import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("RLA instruction integration tests", () => {
  let cpu: CPU;

  it("RLA zero page applies ROL then AND, sets flags, consumes 5 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0b11111111;
    cpu.write(0x10, 0b10000000); // bit7 = 1

    const initialCycles = cpu.cycles;
    cpu.step();

    // memória foi rotacionada
    expect(cpu.read(0x10)).toBe(0b00000000);

    // A AND com valor rotacionado
    expect(cpu.registers.A).toBe(0b00000000);

    // carry vem do bit 7 original
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("RLA zero page sets ZERO and NEGATIVE correctly", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0xff;
    cpu.write(0x10, 0x00);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("RLA zero page,X consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ZERO_PAGE_X,
        0x10,
      ]),
    );

    cpu.registers.X = 0x01;
    cpu.registers.A = 0xff;

    cpu.write(0x11, 0b01000000);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x11)).toBe(0b10000000);
    expect(cpu.registers.A).toBe(0b10000000);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RLA absolute consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ABSOLUTE,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.A = 0xff;
    cpu.write(0x1000, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x04);
    expect(cpu.registers.A).toBe(0x04);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RLA absolute,X consumes 7 cycles (no page crossing extra)", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ABSOLUTE_X,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.X = 0x01;
    cpu.registers.A = 0xff;

    cpu.write(0x1001, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("RLA absolute,Y consumes 7 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ABSOLUTE_Y,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.Y = 0x01;
    cpu.registers.A = 0xff;

    cpu.write(0x1001, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("RLA (indirect,X) consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_INDIRECT_X,
        0x10,
      ]),
    );

    cpu.registers.X = 0x04;
    cpu.registers.A = 0xff;

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(8);
  });

  it("RLA (indirect),Y consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_INDIRECT_Y,
        0x10,
      ]),
    );

    cpu.registers.Y = 0x01;
    cpu.registers.A = 0xff;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x01);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x02);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(8);
  });

  it("RLA sets carry from bit 7", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0xff;
    cpu.write(0x10, 0b10000000);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("RLA clears carry when bit 7 is 0", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_LEFT_AND_AND_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0xff;
    cpu.write(0x10, 0b01000000);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
  });
});
