import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("CLD instruction", () => {
  it("clears decimal flag and consumes 2 cycles", () => {
    const cpu = new CPU(allInstruction);
    const initialCycles = cpu.cycles;

    cpu.status.setFlag(Flag.DECIMAL, true);

    cpu.loadProgram([Opcode.CLEAR_DECIMAL_FLAG]);
    cpu.step();

    expect(cpu.status.is(Flag.DECIMAL)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
