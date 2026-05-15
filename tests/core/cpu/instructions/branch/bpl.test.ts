import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("BPL instruction integration tests", () => {
  let cpu: CPU;

  it("BPL branches when negative flag is clear", () => {
    // offset +2
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_POSITIVE, 0x02]));

    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, false);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 + 2);
    expect(cpu.cycles - initialCycles).toBe(3); // 2 + 1 (branch taken)
  });

  it("BPL does not branch when negative flag is set", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_POSITIVE, 0x02]));

    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, true);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("BPL supports negative offset (backward branch)", () => {
    // -2 (0xFE signed)
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_POSITIVE, 0xfe]));

    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, false);

    const initialPC = cpu.registers.PC;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 - 2);
  });

  it("BPL adds 1 extra cycle when branch crosses page", () => {
    // força page cross
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_POSITIVE, 0x02], 0x80fd));

    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, false);
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4); // 2 + 1 (taken) + 1 (page cross)
  });

  it("BPL does not add page cycle if branch not taken", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_POSITIVE, 0x02], 0x80fd));

    cpu.registers.STATUS.setFlag(Flag.NEGATIVE, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
