import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("BIT instruction integration tests", () => {
  let cpu: CPU;

  it("BIT zero page sets Z, N, V correctly, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BIT_TEST_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0b00110000;
    cpu.write(0x0010, 0b11000000); // N=1, V=1

    const initialCycles = cpu.cycles;

    cpu.step();

    // A não muda
    expect(cpu.registers.A).toBe(0b00110000);

    // A & M = 0 → Z = 1
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);

    // vindo da memória
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true); // bit 7
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true); // bit 6

    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("BIT zero page with non-zero AND clears Z", () => {
    cpu = createCPU(new FakeRom([Opcode.BIT_TEST_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0b11110000;
    cpu.write(0x0010, 0b10000000);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(false);
  });

  it("BIT absolute sets flags correctly, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BIT_TEST_ABSOLUTE, 0x00, 0x11]));

    cpu.registers.A = 0b00001111;
    cpu.write(0x1100, 0b01000000); // V=1

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b00001111);

    // A & M = 0 → Z = 1
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);

    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.OVERFLOW)).toBe(true);

    expect(cpu.cycles - initialCycles).toBe(4);
  });
});
