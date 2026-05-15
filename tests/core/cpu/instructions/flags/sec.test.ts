import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("SEC instruction", () => {
  it("sets carry flag and consumes 2 cycles", () => {
    const cpu = createCPU(new FakeRom([Opcode.SET_CARRY_FLAG]));
    const initialCycles = cpu.cycles;

    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
