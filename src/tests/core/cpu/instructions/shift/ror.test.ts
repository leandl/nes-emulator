import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ROR instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ROR accumulator shifts right through carry", () => {
    // Carry = 0
    cpu.registers.A = 0x02; // 0000 0010 -> 0000 0001
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ACCUMULATOR]);
    cpu.step();

    expect(cpu.registers.A).toBe(0x01);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Carry entra no bit 7
    cpu.registers.A = 0x02; // -> 1000 0001
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ACCUMULATOR], 0x8001);
    cpu.step();

    expect(cpu.registers.A).toBe(0x81);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);

    // Carry sai do bit 0
    cpu.registers.A = 0x01; // -> 0000 0000
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ACCUMULATOR], 0x8002);
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ROR zero page shifts memory correctly", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x04); // -> 0x02
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x02);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
  });

  it("ROR zero page uses carry input", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x02); // -> 0x81
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE, addr], 0x8001);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x81);
  });

  it("ROR zero page sets carry correctly", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x01); // -> 0x00
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE, addr], 0x8002);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
  });

  it("ROR absolute shifts memory correctly", () => {
    const addr = 0x1234;

    cpu.memory.write(addr, 0x08); // -> 0x04
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ABSOLUTE, 0x34, 0x12]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x04);
  });

  it("ROR zero page,X uses X offset", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;

    cpu.memory.write(base + 0x05, 0x06); // -> 0x03
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE_X, base]);

    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x03);
  });

  it("ROR absolute,X uses X offset", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;

    cpu.memory.write(base + 0x02, 0x08); // -> 0x04
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ABSOLUTE_X, 0x00, 0x20]);

    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x04);
  });
});
