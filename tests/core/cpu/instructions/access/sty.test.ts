import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("STY instruction integration tests", () => {
  let cpu: CPU;

  it("STY zero page stores Y, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_Y_REGISTER_ZERO_PAGE, 0x10]));

    cpu.registers.Y = 0x42;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0010)).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("STY zero page X stores Y with X offset, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_Y_REGISTER_ZERO_PAGE_X, 0x10]));

    cpu.registers.Y = 0x55;
    cpu.registers.X = 0x05;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0015)).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("STY absolute stores Y, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_Y_REGISTER_ABSOLUTE, 0x00, 0x11]),
    );

    cpu.registers.Y = 0x77;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x1100)).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });
});
