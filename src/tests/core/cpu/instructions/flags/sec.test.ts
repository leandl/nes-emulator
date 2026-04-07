import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("SEC instruction", () => {
  it("sets carry flag and consumes 2 cycles", () => {
    const cpu = new CPU(allInstruction);
    const initialCycles = cpu.cycles;

    cpu.status.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.SET_CARRY_FLAG]);
    cpu.step();

    expect(cpu.status.is(Flag.CARRY)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
