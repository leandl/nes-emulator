import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("CPY instruction integration tests", () => {
  let cpu: CPU;

  it("CPY immediate sets flags correctly, consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_Y_REGISTER_IMMEDIATE, 0x40]));

    cpu.registers.Y = 0x50;

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.Y).toBe(0x50); // não altera Y
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(new FakeRom([Opcode.COMPARE_Y_REGISTER_IMMEDIATE, 0x50]));

    cpu.registers.Y = 0x50;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    cpu = createCPU(new FakeRom([Opcode.COMPARE_Y_REGISTER_IMMEDIATE, 0x60]));

    cpu.registers.Y = 0x50;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true); // wrap (0x50 - 0x60)
  });

  it("CPY zero page, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_Y_REGISTER_ZERO_PAGE, 0x10]));

    cpu.registers.Y = 0x30;
    cpu.write(0x0010, 0x20);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("CPY absolute, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.COMPARE_Y_REGISTER_ABSOLUTE, 0x00, 0x10]),
    );

    cpu.registers.Y = 0x80;
    cpu.write(0x1000, 0x80);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("CPY negative flag uses bit 7 of result (wrap behavior)", () => {
    cpu = createCPU(new FakeRom([Opcode.COMPARE_Y_REGISTER_ZERO_PAGE, 0x10]));

    cpu.registers.Y = 0x00;
    cpu.write(0x0010, 0x01);

    cpu.step();

    // 0x00 - 0x01 = 0xFF → bit 7 = 1
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
  });
});
