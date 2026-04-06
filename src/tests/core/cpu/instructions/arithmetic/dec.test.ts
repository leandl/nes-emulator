import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("DEC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("DEC decrements memory and updates flags (Zero Page)", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x10);

    loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("DEC sets ZERO flag when result is 0", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x01);

    loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("DEC sets NEGATIVE flag when result has bit 7 set", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x00);

    loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("DEC does not affect CARRY or OVERFLOW flags", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x05);

    cpu.status.setFlag(Flag.CARRY, true);
    cpu.status.setFlag(Flag.OVERFLOW, true);

    loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x04);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
  });

  it("DEC wraps from 0x00 to 0xFF (underflow)", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x00);

    loadProgram([Opcode.DECREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0xff);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });
});
