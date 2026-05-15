import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("PHA instruction integration tests", () => {
  let cpu: CPU;

  it("PHA pushes accumulator to stack and decrements SP, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PUSH_ACCUMULATOR]), {
      A: 0x42,
      SP: 0xff,
    });

    const initialCycles = cpu.cycles;

    cpu.step();

    // valor foi empilhado
    expect(cpu.read(0x01ff)).toBe(0x42);

    // SP decrementado
    expect(cpu.registers.SP).toBe(0xfe);

    // ciclos
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("PHA uses correct stack address based on SP", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PUSH_ACCUMULATOR]), {
      A: 0x99,
      SP: 0x80,
    });

    cpu.step();

    expect(cpu.read(0x0180)).toBe(0x99);
    expect(cpu.registers.SP).toBe(0x7f);
  });

  it("PHA does not modify flags", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PUSH_ACCUMULATOR]));

    cpu.registers.A = 0x10;

    // seta flags manualmente
    cpu.registers.STATUS.raw = 0b11111111;

    cpu.step();

    expect(cpu.registers.STATUS.raw).toBe(0b11111111);
  });

  it("PHA wraps stack pointer (underflow behavior)", () => {
    cpu = createCPU(new FakeRom([Opcode.STACK_PUSH_ACCUMULATOR]));

    cpu.registers.A = 0x55;
    cpu.registers.SP = 0x00;

    cpu.step();

    // escreve em 0x0100
    expect(cpu.read(0x0100)).toBe(0x55);

    // wrap: 0x00 -> 0xFF
    expect(cpu.registers.SP).toBe(0xff);
  });
});
