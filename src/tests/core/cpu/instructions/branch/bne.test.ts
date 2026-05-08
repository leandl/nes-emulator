import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("BNE instruction integration tests", () => {
  let cpu: CPU;

  it("BNE branches when zero flag is clear", () => {
    // offset +2
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_NOT_EQUAL, 0x02]));

    cpu.registers.STATUS.setFlag(Flag.ZERO, false);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 + 2);
    expect(cpu.cycles - initialCycles).toBe(3); // 2 + 1 (branch taken)
  });

  it("BNE does not branch when zero flag is set", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_NOT_EQUAL, 0x02]));

    cpu.registers.STATUS.setFlag(Flag.ZERO, true);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("BNE supports negative offset (backward branch)", () => {
    // -2 em signed (0xFE)
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_NOT_EQUAL, 0xfe]));

    cpu.registers.STATUS.setFlag(Flag.ZERO, false);

    const initialPC = cpu.registers.PC;
    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 - 2);
  });

  it("BNE adds 1 extra cycle when branch crosses page", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_NOT_EQUAL, 0x02], 0x80fd));

    cpu.registers.STATUS.setFlag(Flag.ZERO, false);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4); // 2 + 1 (taken) + 1 (page cross)
  });

  it("BNE does not add page cycle if branch not taken", () => {
    cpu = createCPU(new FakeRom([Opcode.BRANCH_IF_NOT_EQUAL, 0x02], 0x80fd));

    cpu.registers.STATUS.setFlag(Flag.ZERO, true);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
