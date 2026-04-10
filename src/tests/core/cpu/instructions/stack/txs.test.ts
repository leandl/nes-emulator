import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("TXS instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("TXS transfers X to Stack Pointer, does NOT update flags and consumes 2 cycles", () => {
    cpu.registers.X = 0x42;

    // flags previamente setados
    cpu.registers.STATUS.raw = 0b11111111;

    cpu.loadProgram([Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]);
    let initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.SP).toBe(0x42);

    // flags NÃO devem mudar
    expect(cpu.registers.STATUS.raw).toBe(0b11111111);

    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("TXS does not affect ZERO or NEGATIVE flags", () => {
    cpu.registers.X = 0x00;

    cpu.registers.STATUS.raw = 0;

    cpu.loadProgram([Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]);

    cpu.step();

    expect(cpu.registers.SP).toBe(0x00);

    // mesmo sendo zero, flags não mudam
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });

  it("TXS works with negative values but does not update flags", () => {
    cpu.registers.X = 0x80;

    cpu.registers.STATUS.raw = 0;

    cpu.loadProgram([Opcode.TRANSFER_X_REGISTER_TO_STACK_POINTER]);

    cpu.step();

    expect(cpu.registers.SP).toBe(0x80);

    // mesmo com bit 7, não seta NEGATIVE
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
  });
});
