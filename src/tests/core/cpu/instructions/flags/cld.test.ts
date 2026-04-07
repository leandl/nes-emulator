import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("CLD instruction", () => {
  it("clears decimal flag", () => {
    const cpu = new CPU(allInstruction);

    cpu.status.setFlag(Flag.DECIMAL, true);

    cpu.loadProgram([Opcode.CLEAR_DECIMAL_FLAG]);
    cpu.step();

    expect(cpu.status.is(Flag.DECIMAL)).toBe(false);
  });
});
