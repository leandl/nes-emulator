import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/instructions/factories/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("DEY instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function loadProgram(program: number[], startAddress = 0x8000) {
    cpu.memory.load(program, startAddress);
    cpu.registers.PC = startAddress;
  }

  it("DEY decrements Y and updates flags", () => {
    cpu.registers.Y = 0x10;
    loadProgram([Opcode.DECREMENT_Y_REGISTER]);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);

    cpu.registers.Y = 0x01;
    loadProgram([Opcode.DECREMENT_Y_REGISTER], 0x8001);
    cpu.step();
    expect(cpu.registers.Y).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);

    cpu.registers.Y = 0x00;
    loadProgram([Opcode.DECREMENT_Y_REGISTER], 0x8002);
    cpu.step();
    expect(cpu.registers.Y).toBe(0xff);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });
});
