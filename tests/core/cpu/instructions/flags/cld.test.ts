import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("CLD instruction", () => {
  it("clears decimal flag and consumes 2 cycles", () => {
    const cpu = createCPU(new FakeRom([Opcode.CLEAR_DECIMAL_FLAG]));
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.DECIMAL, true);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.DECIMAL)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
