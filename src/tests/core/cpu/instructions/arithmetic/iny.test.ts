import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("INY instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("INY increments Y and updates flags, consumes 2 cycles", () => {
    // Valor normal
    cpu.registers.Y = 0x10;
    cpu.loadProgram([Opcode.INCREMENT_Y_REGISTER]);
    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.Y).toBe(0x11);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu.registers.Y = 0xff;
    cpu.loadProgram([Opcode.INCREMENT_Y_REGISTER], 0x8001);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.Y).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag (bit 7)
    cpu.registers.Y = 0x7f;
    cpu.loadProgram([Opcode.INCREMENT_Y_REGISTER], 0x8002);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.Y).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
