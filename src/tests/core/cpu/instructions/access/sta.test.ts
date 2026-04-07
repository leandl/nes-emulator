import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("STA instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("STA zero page stores accumulator", () => {
    cpu.registers.A = 0x42;
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_ZERO_PAGE, 0x10]);
    cpu.step();
    expect(cpu.memory.read(0x0010)).toBe(0x42);
  });

  it("STA zero page X stores accumulator with X offset", () => {
    cpu.registers.A = 0x55;
    cpu.registers.X = 0x05;
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_ZERO_PAGE_X, 0x10]);
    cpu.step();
    expect(cpu.memory.read(0x0015)).toBe(0x55);
  });

  it("STA absolute stores accumulator", () => {
    cpu.registers.A = 0x77;
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_ABSOLUTE, 0x00, 0x20]);
    cpu.step();
    expect(cpu.memory.read(0x2000)).toBe(0x77);
  });

  it("STA absolute X stores accumulator", () => {
    cpu.registers.A = 0x88;
    cpu.registers.X = 0x03;
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_ABSOLUTE_X, 0x00, 0x20]);
    cpu.step();
    expect(cpu.memory.read(0x2003)).toBe(0x88);
  });

  it("STA absolute Y stores accumulator", () => {
    cpu.registers.A = 0x99;
    cpu.registers.Y = 0x02;
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_ABSOLUTE_Y, 0x00, 0x20]);
    cpu.step();
    expect(cpu.memory.read(0x2002)).toBe(0x99);
  });

  it("STA (indirect,X) stores accumulator", () => {
    cpu.registers.A = 0xaa;
    cpu.registers.X = 0x04;

    // Instrução + base zero page
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_INDIRECT_X, 0x10]);

    // Configura ponteiro indireto em zero page
    cpu.memory.write(0x14, 0x00); // low
    cpu.memory.write(0x15, 0x20); // high → endereço final 0x2000

    cpu.step();
    expect(cpu.memory.read(0x2000)).toBe(0xaa);
  });

  it("STA (indirect),Y stores accumulator", () => {
    cpu.registers.A = 0xbb;
    cpu.registers.Y = 0x01;

    // Instrução + base zero page
    cpu.loadProgram([Opcode.STORE_ACCUMULATOR_INDIRECT_Y, 0x10]);

    cpu.memory.write(0x10, 0x00); // low
    cpu.memory.write(0x11, 0x20); // high → 0x2000 + Y = 0x2001

    cpu.step();
    expect(cpu.memory.read(0x2001)).toBe(0xbb);
  });
});
