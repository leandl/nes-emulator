import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("DEX instruction integration tests", () => {
  let cpu: CPU;

  it("DEX decrements X and updates flags, consumes 2 cycles", () => {
    // Valor normal
    cpu = createCPU(new FakeRom([Opcode.DECREMENT_X_REGISTER]));

    cpu.registers.X = 0x10;

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.X).toBe(0x0f);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Zero flag
    cpu = createCPU(new FakeRom([Opcode.DECREMENT_X_REGISTER], 0x8001));

    cpu.registers.X = 0x01;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.X).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    // Negative flag (underflow)
    cpu = createCPU(new FakeRom([Opcode.DECREMENT_X_REGISTER], 0x8002));

    cpu.registers.X = 0x00;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.X).toBe(0xff);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);
  });
});
