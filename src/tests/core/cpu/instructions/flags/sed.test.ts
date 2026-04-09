import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("SED instruction", () => {
  it("sets decimal flag and consumes 2 cycles", () => {
    const cpu = new CPU(allInstruction);
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.DECIMAL, false);

    cpu.loadProgram([Opcode.SET_DECIMAL_FLAG]);
    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.DECIMAL)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
