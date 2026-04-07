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
});
