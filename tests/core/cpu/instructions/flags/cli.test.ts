import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("CLI instruction", () => {
  it("clears interrupt disable flag and consumes 2 cycles", () => {
    const cpu = createCPU(new FakeRom([Opcode.CLEAR_INTERRUPT_FLAG]));
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.INTERRUPT_DISABLE, true);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
