import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("DEX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("DEX decrements X and updates flags, consumes 2 cycles", () => {
    // Valor normal
    cpu.registers.X = 0x10;
    cpu.loadProgram([Opcode.DECREMENT_X_REGISTER]);
    let initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x0f);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu.registers.X = 0x01;
    cpu.loadProgram([Opcode.DECREMENT_X_REGISTER], 0x8001);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag (underflow)
    cpu.registers.X = 0x00;
    cpu.loadProgram([Opcode.DECREMENT_X_REGISTER], 0x8002);
    initialCycles = cpu.cycles;
    cpu.step();
    expect(cpu.registers.X).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
