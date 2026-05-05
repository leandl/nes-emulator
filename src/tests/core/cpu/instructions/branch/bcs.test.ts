import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("BCS instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("BCS branches when carry is set", () => {
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    // offset +2
    cpu.loadProgram([Opcode.BRANCH_IF_CARRY_SET, 0x02]);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 + 2);
    expect(cpu.cycles - initialCycles).toBe(3); // 2 + 1 (branch taken)
  });

  it("BCS does not branch when carry is clear", () => {
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.BRANCH_IF_CARRY_SET, 0x02]);

    const initialPC = cpu.registers.PC;
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("BCS supports negative offset (backward branch)", () => {
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    // -2 em signed (0xFE)
    cpu.loadProgram([Opcode.BRANCH_IF_CARRY_SET, 0xfe]);

    const initialPC = cpu.registers.PC;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + 2 - 2);
  });

  it("BCS adds 1 extra cycle when branch crosses page", () => {
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    cpu.loadProgram([Opcode.BRANCH_IF_CARRY_SET, 0x02], 0x80fd);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(4); // 2 + 1 (taken) + 1 (page cross)
  });

  it("BCS does not add page cycle if branch not taken", () => {
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    cpu.loadProgram([Opcode.BRANCH_IF_CARRY_SET, 0x02], 0x20fd);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
