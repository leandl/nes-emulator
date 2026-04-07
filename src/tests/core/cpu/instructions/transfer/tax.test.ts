import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("TAX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("TAX transfers Accumulator to X and updates flags", () => {
    // Valor normal
    cpu.registers.A = 0x42;
    cpu.loadProgram([Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Zero flag
    cpu.registers.A = 0x00;
    cpu.loadProgram([Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER], 0x8001);
    cpu.step();
    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative flag
    cpu.registers.A = 0x80;
    cpu.loadProgram([Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER], 0x8002);
    cpu.step();
    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });
});
