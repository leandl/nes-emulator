import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("PLP instruction integration tests", () => {
  let cpu: CPU;

  it("PLP pulls status from stack, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PULL_PROCESSOR_STATUS]));

    cpu.registers.SP = 0xfe;

    const value = Flag.CARRY | Flag.ZERO;
    cpu.write(0x01ff, value);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);

    expect(cpu.registers.SP).toBe(0xff);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("PLP ignores BREAK flag from stack", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PULL_PROCESSOR_STATUS]));

    cpu.registers.SP = 0xfe;

    const value = Flag.BREAK;
    cpu.write(0x01ff, value);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.BREAK)).toBe(false);
  });

  it("PLP forces UNUSED flag to 1", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PULL_PROCESSOR_STATUS]));

    cpu.registers.SP = 0xfe;

    cpu.write(0x01ff, 0x00);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.UNUSED)).toBe(true);
  });

  it("PLP restores multiple flags correctly", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PULL_PROCESSOR_STATUS]));

    cpu.registers.SP = 0xfe;

    const value =
      Flag.CARRY | Flag.INTERRUPT_DISABLE | Flag.NEGATIVE | Flag.OVERFLOW;

    cpu.write(0x01ff, value);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);
  });

  it("PLP uses correct stack address (SP increment before read)", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PULL_PROCESSOR_STATUS]));

    cpu.registers.SP = 0x80;

    cpu.write(0x0181, Flag.ZERO);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.SP).toBe(0x81);
  });

  it("PLP wraps stack pointer (overflow behavior)", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PULL_PROCESSOR_STATUS]));

    cpu.registers.SP = 0xff;

    // SP++ → 0x00 → 0x0100
    cpu.write(0x0100, Flag.CARRY);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(true);
    expect(cpu.registers.SP).toBe(0x00);
  });
});
