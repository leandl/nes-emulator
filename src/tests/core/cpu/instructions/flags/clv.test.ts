import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("CLV instruction", () => {
  it("clears overflow flag and consumes 2 cycles", () => {
    const cpu = createCPU(new FakeRom([Opcode.CLEAR_OVERFLOW_FLAG]));
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
