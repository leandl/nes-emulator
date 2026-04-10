import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("PLA instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("PLA pulls value from stack into A, updates flags, consumes 4 cycles", () => {
    cpu.registers.SP = 0xfe;

    // valor na stack (SP + 1 = 0xff → 0x01ff)
    cpu.memory.write(0x01ff, 0x42);

    cpu.loadProgram([Opcode.STACK_PULL_ACCUMULATOR]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);

    expect(cpu.registers.SP).toBe(0xff);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("PLA sets ZERO flag when result is 0", () => {
    cpu.registers.SP = 0xfe;
    cpu.memory.write(0x01ff, 0x00);

    cpu.loadProgram([Opcode.STACK_PULL_ACCUMULATOR]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("PLA sets NEGATIVE flag when bit 7 is set", () => {
    cpu.registers.SP = 0xfe;
    cpu.memory.write(0x01ff, 0x80);

    cpu.loadProgram([Opcode.STACK_PULL_ACCUMULATOR]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
  });

  it("PLA uses correct stack address (SP increment before read)", () => {
    cpu.registers.SP = 0x80;

    cpu.memory.write(0x0181, 0x99);

    cpu.loadProgram([Opcode.STACK_PULL_ACCUMULATOR]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x99);
    expect(cpu.registers.SP).toBe(0x81);
  });

  it("PLA wraps stack pointer (overflow behavior)", () => {
    cpu.registers.SP = 0xff;

    // SP++ → 0x00 → endereço 0x0100
    cpu.memory.write(0x0100, 0x55);

    cpu.loadProgram([Opcode.STACK_PULL_ACCUMULATOR]);

    cpu.step();

    expect(cpu.registers.A).toBe(0x55);
    expect(cpu.registers.SP).toBe(0x00);
  });
});
