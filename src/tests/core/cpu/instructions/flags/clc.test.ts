import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("CLC instruction", () => {
  it("clears carry flag", () => {
    const cpu = new CPU(allInstruction);

    cpu.status.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.CLEAR_CARRY_FLAG]);
    cpu.step();

    expect(cpu.status.is(Flag.CARRY)).toBe(false);
  });
});
