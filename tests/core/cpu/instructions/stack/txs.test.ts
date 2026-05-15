import { CPU } from "../../../../../src/core/cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";

describe("TXS instruction integration tests", () => {
  let cpu: CPU;

  it("TXS transfers X to Stack Pointer, does NOT update flags and consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]));

    cpu.registers.X = 0x42;
    // flags previamente setados
    cpu.registers.STATUS.raw = 0b11111111;

    let initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.SP).toBe(0x42);

    // flags NÃO devem mudar
    expect(cpu.registers.STATUS.raw).toBe(0b11111111);

    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("TXS does not affect ZERO or NEGATIVE flags", () => {
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]));

    cpu.registers.X = 0x00;
    cpu.registers.STATUS.raw = 0;

    cpu.step();

    expect(cpu.registers.SP).toBe(0x00);

    // mesmo sendo zero, flags não mudam
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("TXS works with negative values but does not update flags", () => {
    cpu = createCPU(new FakeRom([Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]));

    cpu.registers.X = 0x80;
    cpu.registers.STATUS.raw = 0;

    cpu.step();

    expect(cpu.registers.SP).toBe(0x80);

    // mesmo com bit 7, não seta NEGATIVE
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });
});
