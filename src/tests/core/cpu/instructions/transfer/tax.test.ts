import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("TAX instruction integration tests", () => {
  let cpu: CPU;

  it("TAX transfers Accumulator to X, updates flags and consumes 2 cycles", () => {
    // Valor normal
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER]), {
      A: 0x42,
    });

    let initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER]), {
      A: 0x00,
    });

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_ACCUMULATOR_TO_X_REGISTER]), {
      A: 0x80,
    });
    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
