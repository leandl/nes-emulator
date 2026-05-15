import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("STA instruction integration tests", () => {
  let cpu: CPU;

  it("STA zero page stores accumulator, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_ACCUMULATOR_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0x42;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0010)).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("STA zero page X stores accumulator with X offset, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_ACCUMULATOR_ZERO_PAGE_X, 0x10]));

    cpu.registers.A = 0x55;
    cpu.registers.X = 0x05;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0015)).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("STA absolute stores accumulator, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_ACCUMULATOR_ABSOLUTE, 0x00, 0x11]),
    );

    cpu.registers.A = 0x77;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1100)).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("STA absolute X stores accumulator, consumes 5 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_ACCUMULATOR_ABSOLUTE_X, 0x00, 0x11]),
    );

    cpu.registers.A = 0x88;
    cpu.registers.X = 0x03;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1103)).toBe(0x88);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("STA absolute Y stores accumulator, consumes 5 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_ACCUMULATOR_ABSOLUTE_Y, 0x00, 0x11]),
    );

    cpu.registers.A = 0x99;
    cpu.registers.Y = 0x02;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1102)).toBe(0x99);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("STA (indirect,X) stores accumulator, consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_ACCUMULATOR_INDIRECT_X, 0x10]));

    cpu.registers.A = 0xaa;
    cpu.registers.X = 0x04;

    cpu.write(0x14, 0x00); // low
    cpu.write(0x15, 0x11); // high → endereço final 0x1100

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1100)).toBe(0xaa);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("STA (indirect),Y stores accumulator, consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_ACCUMULATOR_INDIRECT_Y, 0x10]));

    cpu.registers.A = 0xbb;
    cpu.registers.Y = 0x01;
    cpu.write(0x10, 0x00); // low
    cpu.write(0x11, 0x11); // high → 0x1100 + Y = 0x1101

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1101)).toBe(0xbb);
    expect(cpu.cycles - initialCycles).toBe(6);
  });
});
