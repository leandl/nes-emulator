import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("STX instruction integration tests", () => {
  let cpu: CPU;

  it("STX zero page stores X, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_X_REGISTER_ZERO_PAGE, 0x10]));

    cpu.registers.X = 0x42;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0010)).toBe(0x42);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("STX zero page Y stores X with Y offset, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STORE_X_REGISTER_ZERO_PAGE_Y, 0x10]));

    cpu.registers.X = 0x55;
    cpu.registers.Y = 0x05;

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(0x0015)).toBe(0x55);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("STX absolute stores X, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.STORE_X_REGISTER_ABSOLUTE, 0x00, 0x11]),
    );

    cpu.registers.X = 0x77;
    const initialCycles = cpu.cycles;

    cpu.step();
    expect(cpu.read(0x1100)).toBe(0x77);
    expect(cpu.cycles - initialCycles).toBe(4);
  });
});
