import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("PHP instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("PHP pushes status to stack with B and UNUSED set, consumes 3 cycles", () => {
    cpu.registers.SP = 0xff;

    // status com alguns flags
    cpu.registers.STATUS.raw = Flag.CARRY | Flag.ZERO | Flag.NEGATIVE;

    cpu.loadProgram([Opcode.STACK_PUSH_PROCESSOR_STATUS]);
    const initialCycles = cpu.cycles;

    cpu.step();

    const pushed = cpu.memory.read(0x01ff);

    // flags originais continuam
    expect(pushed & Flag.CARRY).toBeTruthy();
    expect(pushed & Flag.ZERO).toBeTruthy();
    expect(pushed & Flag.NEGATIVE).toBeTruthy();

    // B e UNUSED DEVEM estar setados
    expect(pushed & Flag.BREAK).toBeTruthy();
    expect(pushed & Flag.UNUSED).toBeTruthy();

    // SP decrementa
    expect(cpu.registers.SP).toBe(0xfe);

    // ciclos
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("PHP always forces BREAK and UNUSED bits to 1", () => {
    cpu.registers.SP = 0xff;

    // status sem esses bits
    cpu.registers.STATUS.raw = 0x00;

    cpu.loadProgram([Opcode.STACK_PUSH_PROCESSOR_STATUS]);

    cpu.step();

    const pushed = cpu.memory.read(0x01ff);

    expect(pushed & Flag.BREAK).toBeTruthy();
    expect(pushed & Flag.UNUSED).toBeTruthy();
  });

  it("PHP uses correct stack address based on SP", () => {
    cpu.registers.SP = 0x80;

    cpu.registers.STATUS.raw = 0xaa;

    cpu.loadProgram([Opcode.STACK_PUSH_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.memory.read(0x0180)).toBeDefined();
    expect(cpu.registers.SP).toBe(0x7f);
  });

  it("PHP does not modify the actual status register", () => {
    const original = 0b01010101;

    cpu.registers.STATUS.raw = original;

    cpu.loadProgram([Opcode.STACK_PUSH_PROCESSOR_STATUS]);

    cpu.step();

    expect(cpu.registers.STATUS.raw).toBe(original);
  });

  it("PHP wraps stack pointer (underflow behavior)", () => {
    cpu.registers.SP = 0x00;

    cpu.registers.STATUS.raw = 0xff;

    cpu.loadProgram([Opcode.STACK_PUSH_PROCESSOR_STATUS]);

    cpu.step();

    // escreve em 0x0100
    expect(cpu.memory.read(0x0100)).toBeDefined();

    // wrap
    expect(cpu.registers.SP).toBe(0xff);
  });
});
