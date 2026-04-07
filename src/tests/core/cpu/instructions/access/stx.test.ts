import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("STX instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("STX zero page stores X", () => {
    cpu.registers.X = 0x42;
    cpu.loadProgram([Opcode.STORE_X_REGISTER_ZERO_PAGE, 0x10]);
    cpu.step();
    expect(cpu.memory.read(0x0010)).toBe(0x42);
  });

  it("STX zero page Y stores X with Y offset", () => {
    cpu.registers.X = 0x55;
    cpu.registers.Y = 0x05;
    cpu.loadProgram([Opcode.STORE_X_REGISTER_ZERO_PAGE_Y, 0x10]);
    cpu.step();
    expect(cpu.memory.read(0x0015)).toBe(0x55);
  });

  it("STX absolute stores X", () => {
    cpu.registers.X = 0x77;
    cpu.loadProgram([Opcode.STORE_X_REGISTER_ABSOLUTE, 0x00, 0x20]);
    cpu.step();
    expect(cpu.memory.read(0x2000)).toBe(0x77);
  });
});
