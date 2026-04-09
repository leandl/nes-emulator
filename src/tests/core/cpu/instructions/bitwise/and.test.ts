import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("AND instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("AND immediate applies bitwise AND and sets flags, consumes 2 cycles", () => {
    cpu.registers.A = 0b11001100;

    cpu.loadProgram([Opcode.BITWISE_AND_IMMEDIATE, 0b10101010]);
    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b10001000);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu.registers.A = 0xff;
    cpu.loadProgram([Opcode.BITWISE_AND_IMMEDIATE, 0x00]);
    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("AND zero page, consumes 3 cycles", () => {
    cpu.registers.A = 0b11110000;
    cpu.memory.write(0x0010, 0b10101010);

    cpu.loadProgram([Opcode.BITWISE_AND_ZERO_PAGE, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10100000);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("AND zero page X, consumes 4 cycles", () => {
    cpu.registers.A = 0xff;
    cpu.registers.X = 0x05;

    cpu.memory.write(0x0015, 0b01010101);

    cpu.loadProgram([Opcode.BITWISE_AND_ZERO_PAGE_X, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b01010101);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute, consumes 4 cycles", () => {
    cpu.registers.A = 0b11111111;

    cpu.memory.write(0x2000, 0b00001111);

    cpu.loadProgram([Opcode.BITWISE_AND_ABSOLUTE, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b00001111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute X, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.A = 0xff;
    cpu.registers.X = 0x03;

    cpu.memory.write(0x2003, 0b11110000);

    cpu.loadProgram([Opcode.BITWISE_AND_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11110000);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute X adds 1 cycle when page is crossed", () => {
    cpu.registers.A = 0xff;
    cpu.registers.X = 0x01;

    // 0x20FF + 0x01 = 0x2100 (page cross)
    cpu.memory.write(0x2100, 0b10101010);

    cpu.loadProgram([Opcode.BITWISE_AND_ABSOLUTE_X, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10101010);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("AND absolute Y, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x02;

    cpu.memory.write(0x2002, 0b00111100);

    cpu.loadProgram([Opcode.BITWISE_AND_ABSOLUTE_Y, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b00111100);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute Y adds 1 cycle when page is crossed", () => {
    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x2100, 0b11001100);

    cpu.loadProgram([Opcode.BITWISE_AND_ABSOLUTE_Y, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11001100);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("AND (indirect,X), consumes 6 cycles", () => {
    cpu.registers.A = 0xff;
    cpu.registers.X = 0x04;

    cpu.memory.write(0x14, 0x00);
    cpu.memory.write(0x15, 0x20);
    cpu.memory.write(0x2000, 0b10101010);

    cpu.loadProgram([Opcode.BITWISE_AND_INDIRECT_X, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b10101010);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("AND (indirect),Y, consumes 5 cycles (+1 if page crossed)", () => {
    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x01;

    cpu.memory.write(0x10, 0x00);
    cpu.memory.write(0x11, 0x20);
    cpu.memory.write(0x2001, 0b11001100);

    cpu.loadProgram([Opcode.BITWISE_AND_INDIRECT_Y, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11001100);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("AND (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x01;

    // ponteiro -> 0x20FF
    cpu.memory.write(0x10, 0xff);
    cpu.memory.write(0x11, 0x20);

    // 0x20FF + 0x01 = 0x2100
    cpu.memory.write(0x2100, 0b11110000);

    cpu.loadProgram([Opcode.BITWISE_AND_INDIRECT_Y, 0x10]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11110000);
    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });
});
