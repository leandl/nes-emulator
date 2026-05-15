import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("AND instruction integration tests", () => {
  let cpu: CPU;

  it("AND immediate applies bitwise AND and sets flags, consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_IMMEDIATE, 0b10101010]));

    cpu.registers.A = 0b11001100;

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b10001000);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(true);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_IMMEDIATE, 0x00]));

    cpu.registers.A = 0xff;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("AND zero page, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0b11110000;
    cpu.write(0x0010, 0b10101010);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b10100000);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("AND zero page X, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ZERO_PAGE_X, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.X = 0x05;

    cpu.write(0x0015, 0b01010101);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b01010101);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute, consumes 4 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ABSOLUTE, 0x00, 0x10]));

    cpu.registers.A = 0b11111111;
    cpu.write(0x1000, 0b00001111);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b00001111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute X, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ABSOLUTE_X, 0x00, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.X = 0x03;

    cpu.write(0x1003, 0b11110000);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b11110000);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute X adds 1 cycle when page is crossed", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ABSOLUTE_X, 0xff, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.X = 0x01;

    // 0x10FF + 0x01 = 0x1100 (page cross)
    cpu.write(0x1100, 0b10101010);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b10101010);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("AND absolute Y, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ABSOLUTE_Y, 0x00, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x02;

    cpu.write(0x1002, 0b00111100);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b00111100);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("AND absolute Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_ABSOLUTE_Y, 0xff, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x01;
    cpu.write(0x1100, 0b11001100);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b11001100);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("AND (indirect,X), consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_INDIRECT_X, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.X = 0x04;

    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0b10101010);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b10101010);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("AND (indirect),Y, consumes 5 cycles (+1 if page crossed)", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_INDIRECT_Y, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x01;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0b11001100);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b11001100);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("AND (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_AND_INDIRECT_Y, 0x10]));

    cpu.registers.A = 0xff;
    cpu.registers.Y = 0x01;

    // ponteiro -> 0x10FF
    cpu.write(0x10, 0xff);
    cpu.write(0x11, 0x10);

    // 0x10FF + 0x01 = 0x1100
    cpu.write(0x1100, 0b11110000);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11110000);
    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });
});
