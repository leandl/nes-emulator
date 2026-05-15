import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("TSX instruction integration tests", () => {
  let cpu: CPU;

  it("TSX transfers Stack Pointer to X, updates flags and consumes 2 cycles", () => {
    // Valor normal
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER]));
    cpu.registers.SP = 0x42;

    let initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x42);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu = createCPU(
      new FakeRom([Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER], 0x8001),
    );
    cpu.registers.SP = 0x00;

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag
    cpu = createCPU(
      new FakeRom([Opcode.TRANSFER_STACK_POINTER_TO_X_REGISTER], 0x8002),
    );
    cpu.registers.SP = 0x80;

    initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.X).toBe(0x80);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
