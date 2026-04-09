import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("PLP instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("PLP pulls status from stack, consumes 4 cycles", () => {
    cpu.registers.SP = 0xfe;

    const value = Flag.CARRY | Flag.ZERO;
    cpu.memory.write(0x01ff, value);

    cpu.loadProgram([Opcode.STACK_PULL_PROCESSOR_STATUS]);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);

    expect(cpu.registers.SP).toBe(0xff);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("PLP ignores BREAK flag from stack", () => {
    cpu.registers.SP = 0xfe;

    const value = Flag.BREAK;
    cpu.memory.write(0x01ff, value);

    cpu.loadProgram([Opcode.STACK_PULL_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.BREAK)).toBe(false);
  });

  it("PLP forces UNUSED flag to 1", () => {
    cpu.registers.SP = 0xfe;

    cpu.memory.write(0x01ff, 0x00);

    cpu.loadProgram([Opcode.STACK_PULL_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.UNUSED)).toBe(true);
  });

  it("PLP restores multiple flags correctly", () => {
    cpu.registers.SP = 0xfe;

    const value =
      Flag.CARRY | Flag.INTERRUPT_DISABLE | Flag.NEGATIVE | Flag.OVERFLOW;

    cpu.memory.write(0x01ff, value);

    cpu.loadProgram([Opcode.STACK_PULL_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });

  it("PLP uses correct stack address (SP increment before read)", () => {
    cpu.registers.SP = 0x80;

    cpu.memory.write(0x0181, Flag.ZERO);

    cpu.loadProgram([Opcode.STACK_PULL_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.SP).toBe(0x81);
  });

  it("PLP wraps stack pointer (overflow behavior)", () => {
    cpu.registers.SP = 0xff;

    // SP++ → 0x00 → 0x0100
    cpu.memory.write(0x0100, Flag.CARRY);

    cpu.loadProgram([Opcode.STACK_PULL_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.SP).toBe(0x00);
  });
});
