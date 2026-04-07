import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("INX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("INX increments X and updates flags, consumes 2 cycles", () => {
    // Valor normal
    cpu.registers.X = 0x10;
    cpu.loadProgram([Opcode.INCREMENT_X_REGISTER]);
    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x11);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu.registers.X = 0xff;
    cpu.loadProgram([Opcode.INCREMENT_X_REGISTER], 0x8001);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag (bit 7)
    cpu.registers.X = 0x7f;
    cpu.loadProgram([Opcode.INCREMENT_X_REGISTER], 0x8002);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
