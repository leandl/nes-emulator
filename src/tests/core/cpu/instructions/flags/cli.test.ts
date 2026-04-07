import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("CLI instruction", () => {
  it("clears interrupt disable flag", () => {
    const cpu = new CPU(allInstruction);

    cpu.status.setFlag(Flag.INTERRUPT_DISABLE, true);

    cpu.loadProgram([Opcode.CLEAR_INTERRUPT_FLAG]);
    cpu.step();

    expect(cpu.status.is(Flag.INTERRUPT_DISABLE)).toBe(false);
  });
});
