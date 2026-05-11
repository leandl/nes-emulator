import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("SBC (Illegal) instruction integration tests", () => {
  let cpu: CPU;

  it("SBC immediate (2 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x05]),
    );

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x0b);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC subtracts memory from accumulator (no borrow)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x05]),
    );

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true); // sem borrow

    cpu.step();

    expect(cpu.registers.A).toBe(0x0b);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("SBC includes borrow when carry is clear", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x05]),
    );

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false); // com borrow

    cpu.step();

    expect(cpu.registers.A).toBe(0x0a); // 0x10 - 0x05 - 1
  });

  it("SBC wraps underflow (0x00 - 0x01)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x01]),
    );

    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false); // houve borrow
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("SBC sets ZERO flag", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x05]),
    );

    cpu.registers.A = 0x05;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC sets NEGATIVE flag", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x02]),
    );

    cpu.registers.A = 0x01;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("SBC sets OVERFLOW when positive - negative = negative", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB,
        0xb0, // negativo
      ]),
    );

    cpu.registers.A = 0x50; // positivo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });

  it("SBC sets OVERFLOW when negative - positive = positive", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB,
        0x10, // positivo
      ]),
    );

    cpu.registers.A = 0x90; // negativo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC does not set OVERFLOW when signs behave correctly", () => {
    cpu.registers.A = 0x50;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x10]),
    );

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC keeps CARRY set when no borrow occurs", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x10]),
    );

    cpu.registers.A = 0x20;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0x10);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC clears CARRY when borrow occurs", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x20]),
    );

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xf0);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
  });

  it("SBC sets ZERO and keeps CARRY when result is exact zero", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x01]),
    );

    cpu.registers.A = 0x01;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });

  it("SBC sets NEGATIVE and clears CARRY on underflow", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x02]),
    );

    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xfe);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
  });

  it("SBC sets OVERFLOW when negative - negative = positive", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0xf0]),
    ); // negativo

    cpu.registers.A = 0x90; // negativo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0); // positiv
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("SBC sets multiple flags correctly in complex case", () => {
    cpu = createCPU(
      new FakeRom([Opcode.SUBTRACT_WITH_CARRY_IMMEDIATE_EB, 0x01]),
    );

    cpu.registers.A = 0x80; // negativo
    cpu.registers.STATUS.setFlag(Flag.CARRY, false); // força borrow

    cpu.step();

    expect(cpu.registers.A).toBe(0x7e);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
  });
});
