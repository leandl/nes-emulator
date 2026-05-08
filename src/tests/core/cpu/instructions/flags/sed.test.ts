import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

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
