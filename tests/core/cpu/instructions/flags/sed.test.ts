import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("SED instruction", () => {
  it("sets decimal flag and consumes 2 cycles", () => {
    const cpu = createCPU(new FakeRom([Opcode.SET_DECIMAL_FLAG]));
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.DECIMAL, false);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.DECIMAL)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
