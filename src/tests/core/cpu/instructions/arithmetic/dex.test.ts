import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("DEX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("DEX decrements X and updates flags", () => {
    cpu.registers.X = 0x10;
    cpu.loadProgram([Opcode.DECREMENT_X_REGISTER]);
    cpu.step();
    expect(cpu.registers.X).toBe(0x0f);
    expect(cpu.status.is(Flag.ZERO)).toBe(false);

    cpu.registers.X = 0x01;
    cpu.loadProgram([Opcode.DECREMENT_X_REGISTER], 0x8001);
    cpu.step();
    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.status.is(Flag.ZERO)).toBe(true);

    cpu.registers.X = 0x00;
    cpu.loadProgram([Opcode.DECREMENT_X_REGISTER], 0x8002);
    cpu.step();
    expect(cpu.registers.X).toBe(0xff);
    expect(cpu.status.is(Flag.NEGATIVE)).toBe(true);
  });
});
