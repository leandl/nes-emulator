import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("CLC instruction", () => {
  it("clears carry flag and consumes 2 cycles", () => {
    const cpu = createCPU(new FakeRom([Opcode.CLEAR_CARRY_FLAG]));

    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
