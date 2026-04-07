import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ROL instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ROL accumulator shifts left through carry", () => {
    // Carry = 0
    cpu.registers.A = 0x40; // 0100 0000 -> 1000 0000
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ACCUMULATOR]);
    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);

    // Carry = 1 entra no bit 0
    cpu.registers.A = 0x40; // 0100 0000 -> 1000 0001
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ACCUMULATOR], 0x8001);
    cpu.step();

    expect(cpu.registers.A).toBe(0x81);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);

    // Carry sai do bit 7
    cpu.registers.A = 0x80; // -> 0x00
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ACCUMULATOR], 0x8002);
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
  });

  it("ROL zero page shifts memory correctly", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x20); // 0010 0000 -> 0100 0000
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE, addr]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x40);
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
  });

  it("ROL zero page uses carry input", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x20); // -> 0x41
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE, addr], 0x8001);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x41);
  });

  it("ROL zero page sets carry correctly", () => {
    const addr = 0x10;

    cpu.memory.write(addr, 0x80); // -> 0x00
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE, addr], 0x8002);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x00);
    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
  });

  it("ROL absolute shifts memory correctly", () => {
    const addr = 0x1234;

    cpu.memory.write(addr, 0x11); // -> 0x22
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ABSOLUTE, 0x34, 0x12]);

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x22);
  });

  it("ROL zero page,X uses X offset", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;

    cpu.memory.write(base + 0x05, 0x01); // -> 0x02
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE_X, base]);

    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x02);
  });

  it("ROL absolute,X uses X offset", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;

    cpu.memory.write(base + 0x02, 0x02); // -> 0x04
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ABSOLUTE_X, 0x00, 0x20]);

    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x04);
  });
});
