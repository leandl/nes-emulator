import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ORA instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ORA immediate applies bitwise OR and sets flags, consumes 2 cycles", () => {
    cpu.registers.A = 0b11000000;

    cpu.loadProgram([Opcode.BITWISE_OR_IMMEDIATE, 0b00110011]);
    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b11110011);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu.registers.A = 0x00;
    cpu.loadProgram([Opcode.BITWISE_OR_IMMEDIATE, 0x00]);
    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ORA zero page, consumes 3 cycles", () => {
    cpu.registers.A = 0b00001111;
    cpu.memory.write(0x0010, 0b11110000);

    cpu.loadProgram([Opcode.BITWISE_OR_ZERO_PAGE, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("ORA zero page X, consumes 4 cycles", () => {
    cpu.registers.A = 0b10100000;
    cpu.registers.X = 0x05;

    cpu.memory.write(0x0015, 0b00001111);

    cpu.loadProgram([Opcode.BITWISE_OR_ZERO_PAGE_X, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10101111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("ORA absolute, consumes 4 cycles", () => {
    cpu.registers.A = 0b00000000;

    cpu.memory.write(0x2000, 0b11111111);

    cpu.loadProgram([Opcode.BITWISE_OR_ABSOLUTE, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("ORA absolute X, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.A = 0b00001111;
    cpu.registers.X = 0x03;

    cpu.memory.write(0x2003, 0b11110000);

    cpu.loadProgram([Opcode.BITWISE_OR_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("ORA absolute X adds 1 cycle when page is crossed", () => {
    cpu.registers.A = 0b00001111;
    cpu.registers.X = 0x01;

    // 0x20FF + 0x01 = 0x2100 (page cross)
    cpu.memory.write(0x2100, 0b11110000);

    cpu.loadProgram([Opcode.BITWISE_OR_ABSOLUTE_X, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("ORA absolute Y, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.A = 0b00001111;
    cpu.registers.Y = 0x02;

    cpu.memory.write(0x2002, 0b11000000);

    cpu.loadProgram([Opcode.BITWISE_OR_ABSOLUTE_Y, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11001111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("ORA absolute Y adds 1 cycle when page is crossed", () => {
    cpu.registers.A = 0b00001111;
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x2100, 0b11000000);

    cpu.loadProgram([Opcode.BITWISE_OR_ABSOLUTE_Y, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11001111);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("ORA (indirect,X), consumes 6 cycles", () => {
    cpu.registers.A = 0b00000000;
    cpu.registers.X = 0x04;

    cpu.memory.write(0x14, 0x00);
    cpu.memory.write(0x15, 0x20);
    cpu.memory.write(0x2000, 0b10101010);

    cpu.loadProgram([Opcode.BITWISE_OR_INDIRECT_X, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10101010);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ORA (indirect),Y, consumes 5 cycles (+1 if page crossed)", () => {
    cpu.registers.A = 0b00000001;
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x10, 0x00);
    cpu.memory.write(0x11, 0x20);
    cpu.memory.write(0x2001, 0b10000000);

    cpu.loadProgram([Opcode.BITWISE_OR_INDIRECT_Y, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10000001);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ORA (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu.registers.A = 0b00000001;
    cpu.registers.Y = 0x01;

    // ponteiro -> 0x20FF
    cpu.memory.write(0x10, 0xff);
    cpu.memory.write(0x11, 0x20);

    // 0x20FF + 0x01 = 0x2100
    cpu.memory.write(0x2100, 0b10000000);

    cpu.loadProgram([Opcode.BITWISE_OR_INDIRECT_Y, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10000001);
    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });
});
