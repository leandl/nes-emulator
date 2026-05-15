import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("RRA instruction integration tests", () => {
  let cpu: CPU;

  it("RRA zero page applies ROR then ADC, sets flags, consumes 5 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0x01;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);
    cpu.write(0x10, 0b00000001); // bit0 = 1

    const initialCycles = cpu.cycles;
    cpu.step();

    // ROR: 00000001 -> 00000000, carry = 1
    expect(cpu.read(0x10)).toBe(0x00);

    // ADC: 1 + 0 + 1 = 2
    expect(cpu.registers.A).toBe(0x02);

    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("RRA zero page sets ZERO and NEGATIVE correctly", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);
    cpu.write(0x10, 0x00);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("RRA uses carry from ROR as input to ADC", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);
    cpu.write(0x10, 0b00000001); // gera carry no ROR

    cpu.step();

    // A = 0 + 0 + 1
    expect(cpu.registers.A).toBe(0x01);
  });

  it("RRA sets carry from ADC result", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0xff;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);
    cpu.write(0x10, 0b00000001); // ROR -> carry = 1

    cpu.step();

    // 0xff + 0 + 1 = 0x100
    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("RRA sets overflow correctly", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ZERO_PAGE,
        0x10,
      ]),
    );

    cpu.registers.A = 0x7f;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);
    cpu.write(0x10, 0b00000001);

    cpu.step();

    // 0x7f + 0x00 + 1 = 0x80 → overflow
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });

  it("RRA zero page,X consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ZERO_PAGE_X,
        0x10,
      ]),
    );

    cpu.registers.X = 0x01;
    cpu.registers.A = 0x00;
    cpu.write(0x11, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x11)).toBe(0x01);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RRA absolute consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_ABSOLUTE,
        0x00,
        0x10,
      ]),
    );

    cpu.registers.A = 0x01;
    cpu.write(0x1000, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x01);
    expect(cpu.registers.A).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RRA (indirect,X) consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_INDIRECT_X,
        0x10,
      ]),
    );

    cpu.registers.X = 0x04;
    cpu.registers.A = 0x00;

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1000)).toBe(0x01);
    expect(cpu.registers.A).toBe(0x01);
    expect(cpu.cycles - initialCycles).toBe(8);
  });

  it("RRA (indirect),Y consumes 8 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.ROTATE_RIGHT_AND_ADD_WITH_ACCUMULATOR_INDIRECT_Y,
        0x10,
      ]),
    );

    cpu.registers.Y = 0x01;
    cpu.registers.A = 0x00;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x02);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1001)).toBe(0x01);
    expect(cpu.registers.A).toBe(0x01);
    expect(cpu.cycles - initialCycles).toBe(8);
  });
});
