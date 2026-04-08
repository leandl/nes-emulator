import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ADC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ADC immediate (2 cycles)", () => {
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x05]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);

    expect(cpu.registers.A).toBe(0x15);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ADC includes carry flag", () => {
    cpu.registers.A = 0x10;
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x05]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x16);
  });

  it("ADC zero page (3 cycles)", () => {
    cpu.memory.write(0x10, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_ZERO_PAGE, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(3);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC zero page,X (4 cycles)", () => {
    cpu.registers.X = 0x01;
    cpu.memory.write(0x11, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_ZERO_PAGE_X, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC absolute (4 cycles)", () => {
    cpu.memory.write(0x1234, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_ABSOLUTE, 0x34, 0x12]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC absolute,X without page cross (4 cycles)", () => {
    cpu.registers.X = 0x01;
    cpu.memory.write(0x2001, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_ABSOLUTE_X, 0x00, 0x20]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC absolute,X with page cross (5 cycles)", () => {
    cpu.registers.X = 0x01;
    cpu.memory.write(0x2100, 0x05); // cruzou página
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_ABSOLUTE_X, 0xff, 0x20]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC (indirect,X) (6 cycles)", () => {
    cpu.registers.X = 0x04;

    // ponteiro em zero page
    cpu.memory.write(0x14, 0x00);
    cpu.memory.write(0x15, 0x30);

    cpu.memory.write(0x3000, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_INDIRECT_X, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC (indirect),Y without page cross (5 cycles)", () => {
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x10, 0x00);
    cpu.memory.write(0x11, 0x20);

    cpu.memory.write(0x2001, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_INDIRECT_Y, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
    expect(cpu.registers.A).toBe(0x15);
  });

  it("ADC (indirect),Y with page cross (6 cycles)", () => {
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x10, 0xff);
    cpu.memory.write(0x11, 0x20);

    cpu.memory.write(0x2100, 0x05);
    cpu.registers.A = 0x10;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_INDIRECT_Y, 0x10]);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(6);
    expect(cpu.registers.A).toBe(0x15);
  });

  // --- FLAGS (mantive seus testes) ---

  it("ADC sets CARRY on unsigned overflow", () => {
    cpu.registers.A = 0xff;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x01]);
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
  });

  it("ADC sets OVERFLOW when positive + positive = negative", () => {
    cpu.registers.A = 0x50;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x50]);
    cpu.step();

    expect(cpu.registers.A).toBe(0xa0);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("ADC sets OVERFLOW when negative + negative = positive", () => {
    cpu.registers.A = 0x90;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x90]);
    cpu.step();

    expect(cpu.registers.A).toBe(0x20);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
  });

  it("ADC does not set OVERFLOW when signs differ", () => {
    cpu.registers.A = 0x50;

    cpu.loadProgram([Opcode.ADD_WITH_CARRY_IMMEDIATE, 0x90]);
    cpu.step();

    expect(cpu.status.is(Flag.OVERFLOW)).toBe(false);
  });
});
