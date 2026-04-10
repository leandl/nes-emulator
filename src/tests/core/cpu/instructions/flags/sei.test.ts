import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("SEI instruction", () => {
  it("sets interrupt disable flag and consumes 2 cycles", () => {
    const cpu = new CPU(allInstruction);
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.INTERRUPT_DISABLE, false);

    cpu.loadProgram([Opcode.SET_INTERRUPT_FLAG]);
    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
