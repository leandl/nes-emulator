import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("INC instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("INC increments memory and updates flags (Zero Page)", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x10);

    loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x11);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("INC sets ZERO flag when result is 0", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0xff);

    loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("INC sets NEGATIVE flag when bit 7 is set", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x7f);

    loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });

  it("INC does not affect CARRY or OVERFLOW flags", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x01);

    cpu.status.setFlag(Flag.CARRY, true);
    cpu.status.setFlag(Flag.OVERFLOW, true);

    loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x02);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.OVERFLOW)).toBe(true);
  });

  it("INC wraps from 0xFF to 0x00 (overflow)", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0xff);

    loadProgram([Opcode.INCREMENT_MEMORY_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });
});
