import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("TAY instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("TAY transfers Accumulator to Y, updates flags and consumes 2 cycles", () => {
    // Valor normal
    cpu.registers.A = 0x42;
    cpu.loadProgram([Opcode.TRANSFER_ACCUMULATOR_TO_Y_REGISTER]);

    let initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.Y).toBe(0x42);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu.registers.A = 0x00;
    cpu.loadProgram([Opcode.TRANSFER_ACCUMULATOR_TO_Y_REGISTER], 0x8001);

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.Y).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag
    cpu.registers.A = 0x80;
    cpu.loadProgram([Opcode.TRANSFER_ACCUMULATOR_TO_Y_REGISTER], 0x8002);

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.Y).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
