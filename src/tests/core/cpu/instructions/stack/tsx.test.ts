import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("TSX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("TSX transfers Stack Pointer to X, updates flags and consumes 2 cycles", () => {
    // Valor normal
    cpu.registers.SP = 0x42;
    cpu.loadProgram([Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER]);

    let initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu.registers.SP = 0x00;
    cpu.loadProgram([Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER], 0x8001);

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag
    cpu.registers.SP = 0x80;
    cpu.loadProgram([Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER], 0x8002);

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
