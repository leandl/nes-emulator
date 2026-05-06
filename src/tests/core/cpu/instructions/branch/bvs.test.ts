import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("BVS instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("BVS branches when overflow flag is set", () => {
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    // offset +2
    cpu.loadProgram([Opcode.BRANCH_IF_OVERFLOW_SET, 0x02]);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 + 2);
    expect(cpu.cycles - initialCycles).toBe(3); // 2 + 1 (branch taken)
  });

  it("BVS does not branch when overflow flag is clear", () => {
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, false);

    cpu.loadProgram([Opcode.BRANCH_IF_OVERFLOW_SET, 0x02]);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("BVS supports negative offset (backward branch)", () => {
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    // -2 (0xFE signed)
    cpu.loadProgram([Opcode.BRANCH_IF_OVERFLOW_SET, 0xfe]);

    const initialPC = cpu.registers.PC;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 - 2);
  });

  it("BVS adds 1 extra cycle when branch crosses page", () => {
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, true);

    cpu.loadProgram([Opcode.BRANCH_IF_OVERFLOW_SET, 0x02], 0x80fd);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4); // 2 + 1 (taken) + 1 (page cross)
  });

  it("BVS does not add page cycle if branch not taken", () => {
    cpu.registers.STATUS.setFlag(Flag.OVERFLOW, false);

    cpu.loadProgram([Opcode.BRANCH_IF_OVERFLOW_SET, 0x02], 0x20fd);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
