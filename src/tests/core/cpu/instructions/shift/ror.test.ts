import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("ROR instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("ROR accumulator shifts right through carry, consumes 2 cycles", () => {
    cpu.registers.A = 0x02;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ACCUMULATOR]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x01);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ROR accumulator with carry true rotates carry into bit 7", () => {
    cpu.registers.A = 0x02; // 00000010
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ACCUMULATOR]);
    const initialCycles = cpu.cycles;

    cpu.step();

    // esperado:
    // carry entra no bit 7 → 10000001 (0x81)
    expect(cpu.registers.A).toBe(0x81);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false); // bit0 original era 0
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ROR zero page shifts memory correctly, consumes 5 cycles", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x04);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE, addr]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ROR zero page with carry true rotates carry into memory", () => {
    const addr = 0x10;
    cpu.memory.write(addr, 0x04); // 00000100
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE, addr]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x82); // 10000010
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ROR zero page,X uses X offset, consumes 6 cycles", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;
    cpu.memory.write(base + 0x05, 0x06);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE_X, base]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x03);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROR zero page,X with carry true rotates correctly", () => {
    const base = 0x10;
    cpu.registers.X = 0x05;
    cpu.memory.write(base + 0x05, 0x06); // 00000110
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ZERO_PAGE_X, base]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(base + 0x05)).toBe(0x83); // 10000011
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROR absolute shifts memory correctly, consumes 6 cycles", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x08);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ABSOLUTE, 0x34, 0x12]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x04);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROR absolute with carry true rotates correctly", () => {
    const addr = 0x1234;
    cpu.memory.write(addr, 0x08); // 00001000
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ABSOLUTE, 0x34, 0x12]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(addr)).toBe(0x84); // 10000100
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROR absolute,X uses X offset, consumes 7 cycles", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;
    cpu.memory.write(base + 0x02, 0x08);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x04);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("ROR absolute,X with carry true rotates correctly", () => {
    const base = 0x2000;
    cpu.registers.X = 0x02;
    cpu.memory.write(base + 0x02, 0x08); // 00001000
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.ROTATE_RIGHT_ABSOLUTE_X, 0x00, 0x20]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.memory.read(base + 0x02)).toBe(0x84); // 10000100
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });
});
