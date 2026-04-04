import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("TYA instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("TYA transfers Y to Accumulator and updates flags", () => {
    // Valor normal
    cpu.registers.Y = 0x42;
    loadProgram([Opcode.TRANSFER_Y_REGISTER_TO_ACCUMULATOR]);
    cpu.step();
    expect(cpu.registers.A).toBe(0x42);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Zero flag
    cpu.registers.Y = 0x00;
    loadProgram([Opcode.TRANSFER_Y_REGISTER_TO_ACCUMULATOR], 0x8001);
    cpu.step();
    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(false);

    // Negative flag
    cpu.registers.Y = 0x80;
    loadProgram([Opcode.TRANSFER_Y_REGISTER_TO_ACCUMULATOR], 0x8002);
    cpu.step();
    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });
});
