import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("ISC (ISB) instruction integration tests", () => {
  let cpu: CPU;

  it("ISC zero page (5 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]),
    );

    cpu.write(0x10, 0x04); // vira 0x05 após INC
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.read(0x10)).toBe(0x05); // INC aplicado
    expect(cpu.registers.A).toBe(0x0b); // SBC com valor incrementado
  });

  it("ISC zero page,X (6 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE_X, 0x10]),
    );

    cpu.registers.X = 0x01;
    cpu.write(0x11, 0x04);

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.read(0x11)).toBe(0x05);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("ISC absolute (6 cycles)", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ABSOLUTE,
        0x34,
        0x12,
      ]),
    );

    cpu.write(0x1234, 0x04);

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.read(0x1234)).toBe(0x05);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("ISC absolute,X (7 cycles)", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ABSOLUTE_X,
        0x00,
        0x11,
      ]),
    );

    cpu.registers.X = 0x01;
    cpu.write(0x1101, 0x04);

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(7);
    expect(cpu.read(0x1101)).toBe(0x05);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("ISC (indirect,X) (8 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_INDIRECT_X, 0x10]),
    );

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x11);
    cpu.write(0x1100, 0x04);

    cpu.registers.X = 0x04;
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(8);
    expect(cpu.read(0x1100)).toBe(0x05);
    expect(cpu.registers.A).toBe(0x0b);
  });

  it("ISC (indirect),Y (8 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_INDIRECT_Y, 0x10]),
    );

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x11);
    cpu.write(0x1101, 0x04);

    cpu.registers.Y = 0x01;
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(8);
    expect(cpu.read(0x1101)).toBe(0x05);
    expect(cpu.registers.A).toBe(0x0b);
  });

  // ========================
  // Flags (herdados do SBC)
  // ========================

  it("ISC applies borrow correctly", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]),
    );

    cpu.write(0x10, 0x04); // vira 0x05
    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.step();

    expect(cpu.registers.A).toBe(0x0a); // 0x10 - 0x05 - 1
  });

  it("ISC wraps underflow", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]),
    );

    cpu.write(0x10, 0x00); // vira 0x01
    cpu.registers.A = 0x00;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ISC sets ZERO flag", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]),
    );

    cpu.write(0x10, 0x04); // vira 0x05
    cpu.registers.A = 0x05;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
  });

  it("ISC sets NEGATIVE flag", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]),
    );

    cpu.write(0x10, 0x01); // vira 0x02
    cpu.registers.A = 0x01;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ISC sets OVERFLOW correctly", () => {
    cpu = createCPU(
      new FakeRom([Opcode.INCREMENT_AND_SUBTRACT_WITH_CARRY_ZERO_PAGE, 0x10]),
    );

    cpu.write(0x10, 0xaf); // vira 0xb0 (negativo)
    cpu.registers.A = 0x50; // positivo
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });
});
