import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("ADC instruction integration tests", () => {
  let cpu: CPU;

  it("ADC immediate (2 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x05]));

    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x15);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ADC includes carry flag", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x05]));

    cpu.registers.A = 0x10;
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.step();

    expect(cpu.registers.A).toBe(0x16);
  });

  it("ADC zero page (3 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_ZERO_PAGE, 0x10]));

    cpu.write(0x10, 0x05);
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(3);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC zero page,X (4 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_ZERO_PAGE_X, 0x10]));

    cpu.registers.X = 0x01;
    cpu.write(0x11, 0x05);
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC absolute (4 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_ABSOLUTE, 0x34, 0x12]));

    cpu.write(0x1234, 0x05);
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC absolute,X without page cross (4 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.ADD_WITH_CARRY_ABSOLUTE_X, 0x00, 0x10]),
    );

    cpu.registers.X = 0x01;
    cpu.write(0x1001, 0x05);
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC absolute,X with page cross (5 cycles)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.ADD_WITH_CARRY_ABSOLUTE_X, 0xff, 0x10]),
    );

    cpu.registers.X = 0x01;
    cpu.write(0x1100, 0x05); // cruzou página
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC (indirect,X) (6 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_INDIRECT_X, 0x10]));

    // ponteiro em zero page
    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x11);
    cpu.write(0x1100, 0x05);
    cpu.registers.X = 0x04;
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC (indirect),Y without page cross (5 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_INDIRECT_Y, 0x10]));

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0x05);
    cpu.registers.Y = 0x01;
    cpu.registers.A = 0x10;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC (indirect),Y with page cross (6 cycles)", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_INDIRECT_Y, 0x10]));

    cpu.write(0x10, 0xff);
    cpu.write(0x11, 0x10);
    cpu.write(0x1100, 0x05);
    cpu.registers.A = 0x10;
    cpu.registers.Y = 0x01;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.registers.A).toBe(0x15);
  });

  // --- FLAGS (mantive seus testes) ---

  it("ADC sets CARRY on unsigned overflow", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x01]));

    cpu.registers.A = 0xff;

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
  });

  it("ADC sets OVERFLOW when positive + positive = negative", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x50]));

    cpu.registers.A = 0x50;

    cpu.step();

    expect(cpu.registers.A).toBe(0xa0);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ADC sets OVERFLOW when negative + negative = positive", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x90]));

    cpu.registers.A = 0x90;

    cpu.step();

    expect(cpu.registers.A).toBe(0x20);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });

  it("ADC does not set OVERFLOW when signs differ", () => {
    cpu = createCPU(new FakeRom([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x90]));

    cpu.registers.A = 0x50;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });
});
