import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("CLV instruction", () => {
  it("clears overflow flag and consumes 2 cycles", () => {
    const cpu = new CPU(allInstruction);
    const initialCycles = cpu.cycles;

    cpu.status.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.CLEAR_OVERFLOW_FLAG]);
    cpu.step();

    expect(cpu.status.is(Flag.OVERFLOW)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
