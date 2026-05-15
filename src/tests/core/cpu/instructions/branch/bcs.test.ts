import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("BCS instruction integration tests", () => {
  let cpu: CPU;

  it("BCS branches when carry is set", () => {
    // offset +2
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_CARRY_SET, 0x02]));

    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 + 2);
    expect(cpu.cycles - initialCycles).toBe(3); // 2 + 1 (branch taken)
  });

  it("BCS does not branch when carry is clear", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_CARRY_SET, 0x02]));

    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("BCS supports negative offset (backward branch)", () => {
    // -2 em signed (0xFE)
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_CARRY_SET, 0xfe]));

    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialPC = cpu.registers.PC;
    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 - 2);
  });

  it("BCS adds 1 extra cycle when branch crosses page", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_CARRY_SET, 0x02], 0x80fd));

    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4); // 2 + 1 (taken) + 1 (page cross)
  });

  it("BCS does not add page cycle if branch not taken", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_CARRY_SET, 0x02], 0x80fd));

    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
