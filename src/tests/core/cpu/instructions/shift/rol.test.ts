import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ROL instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ROL accumulator shifts left through carry and consumes 2 cycles", () => {
    cpu.registers.A = 0x40;
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ACCUMULATOR]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ROL accumulator with carry true rotates carry into bit 0", () => {
    cpu.registers.A = 0x40; // 01000000
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ACCUMULATOR]);
    const initialCycles = cpu.cycles;

    cpu.step();

    // esperado:
    // shift: 10000000
    // carry entra no bit0 → 10000001 (0x81)
    expect(cpu.registers.A).toBe(0x81);
    expect(cpu.status.is(Flag.CARRY)).toBe(false); // bit7 original era 0
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ROL zero page shifts memory correctly, consumes 5 cycles", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x20);
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE, addr]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x40);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ROL zero page with carry true rotates correctly", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x20); // 00100000
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE, addr]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x41); // 01000001
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ROL zero page,X uses X offset, consumes 6 cycles", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;
    cpu.memory.write(base + 0x05, 0x01);
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE_X, base]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL zero page,X with carry true rotates correctly", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;
    cpu.memory.write(base + 0x05, 0x01); // 00000001
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ZERO_PAGE_X, base]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x03); // 00000011
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL absolute shifts memory correctly, consumes 6 cycles", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x11);
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ABSOLUTE, 0x34, 0x12]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x22);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL absolute with carry true rotates correctly", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x11); // 00010001
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ABSOLUTE, 0x34, 0x12]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x23); // 00100011
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL absolute,X uses X offset, consumes 7 cycles", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;
    cpu.memory.write(base + 0x02, 0x02);
    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x04);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("ROL absolute,X with carry true rotates correctly", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;
    cpu.memory.write(base + 0x02, 0x02); // 00000010
    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_LEFT_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x05); // 00000101
    expect(cpu.status.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });
});
