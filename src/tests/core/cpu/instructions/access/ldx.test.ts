import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("LDX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("LDX immediate loads X and sets flags, consumes 2 cycles", () => {
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_IMMEDIATE, 0x42]);
    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu.loadProgram([Opcode.LOAD_X_REGISTER_IMMEDIATE, 0x00], 0x8002);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu.loadProgram([Opcode.LOAD_X_REGISTER_IMMEDIATE, 0x80], 0x8004);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("LDX zero page loads X, consumes 3 cycles", () => {
    cpu.memory.write(0x0010, 0x55);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ZERO_PAGE, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("LDX zero page Y loads X with Y offset, consumes 4 cycles", () => {
    cpu.registers.Y = 0x05;
    cpu.memory.write(0x0015, 0x77);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ZERO_PAGE_Y, 0x10]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDX absolute loads X, consumes 4 cycles", () => {
    cpu.memory.write(0x2000, 0x99);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ABSOLUTE, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDX absolute Y loads X, consumes 4 cycles (+1 if page crossed)", () => {
    cpu.registers.Y = 0x02;
    cpu.memory.write(0x2002, 0x88);
    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ABSOLUTE_Y, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x88);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("LDX absolute Y adds 1 cycle when page is crossed", () => {
    cpu.registers.Y = 0x01;

    // 0x20FF + 0x01 = 0x2100 (page cross)
    cpu.memory.write(0x2100, 0x42);

    cpu.loadProgram([Opcode.LOAD_X_REGISTER_ABSOLUTE_Y, 0xff, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });
});
