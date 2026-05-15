import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("SAX instruction integration tests", () => {
  let cpu: CPU;

  it("SAX zero page stores accumulator, consumes 3 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_ZERO_PAGE, 0x10]),
    );

    cpu.registers.A = 0x42;
    cpu.registers.X = 0x31;

    const result = cpu.registers.A & cpu.registers.X;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0010)).toBe(result);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("SAX zero page Y stores accumulator with Y offset, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_ZERO_PAGE_Y, 0x10]),
    );

    cpu.registers.Y = 0x05;

    cpu.registers.A = 0x55;
    cpu.registers.X = 0x61;

    const result = cpu.registers.A & cpu.registers.X;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0015)).toBe(result);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("SAX absolute stores accumulator, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([
        Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_ABSOLUTE,
        0x00,
        0x11,
      ]),
    );

    cpu.registers.A = 0x77;
    cpu.registers.X = 0x29;

    const result = cpu.registers.A & cpu.registers.X;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1100)).toBe(result);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("SAX (indirect,X) stores accumulator, consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_ACCUMULATOR_AND_X_REGISTER_INDIRECT_X, 0x10]),
    );

    cpu.registers.A = 0xaa;
    cpu.registers.X = 0x04;

    const result = cpu.registers.A & cpu.registers.X;

    cpu.write(0x14, 0x00); // low
    cpu.write(0x15, 0x11); // high → endereço final 0x1100

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1100)).toBe(result);
    expect(cpu.cycles - initialCycles).toBe(6);
  });
});
