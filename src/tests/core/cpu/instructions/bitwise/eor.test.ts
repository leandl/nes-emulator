import { CPU } from "../../../../../core/cpu";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";

describe("EOR instruction integration tests", () => {
  let cpu: CPU;

  it("EOR immediate applies bitwise XOR and sets flags, consumes 2 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_IMMEDIATE, 0b10101010]),
    );

    cpu.registers.A = 0b11110000;

    let initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b01011010);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(false);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);

    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_IMMEDIATE, 0b11111111]),
    );

    cpu.registers.A = 0b11111111;

    initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x00);
    expect(cpu.registers.STATUS.is(Flag.ZERO)).toBe(true);
    expect(cpu.registers.STATUS.is(Flag.NEGATIVE)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("EOR zero page, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ZERO_PAGE, 0x10]));

    cpu.registers.A = 0b11001100;
    cpu.write(0x0010, 0b10101010);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b01100110);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("EOR zero page X, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ZERO_PAGE_X, 0x10]),
    );

    cpu.registers.A = 0b11110000;
    cpu.registers.X = 0x05;

    cpu.write(0x0015, 0b00001111);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("EOR absolute, consumes 4 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE, 0x00, 0x10]),
    );

    cpu.registers.A = 0b10101010;
    cpu.write(0x1000, 0b11111111);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b01010101);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("EOR absolute X, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE_X, 0x00, 0x10]),
    );

    cpu.registers.A = 0b00001111;
    cpu.registers.X = 0x03;

    cpu.write(0x1003, 0b11110000);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("EOR absolute X adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE_X, 0xff, 0x10]),
    );

    cpu.registers.A = 0b11110000;
    cpu.registers.X = 0x01;

    // 0x10FF + 0x01 = 0x1100 (page cross)
    cpu.write(0x1100, 0b10101010);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b01011010);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("EOR absolute Y, consumes 4 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE_Y, 0x00, 0x10]),
    );

    cpu.registers.A = 0b11111111;
    cpu.registers.Y = 0x02;
    cpu.write(0x1002, 0b11110000);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b00001111);
    expect(cpu.cycles - initialCycles).toBe(4);
  });

  it("EOR absolute Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_ABSOLUTE_Y, 0xff, 0x10]),
    );

    cpu.registers.A = 0b11111111;
    cpu.registers.Y = 0x01;

    cpu.write(0x1100, 0b11110000);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0b00001111);
    expect(cpu.cycles - initialCycles).toBe(5); // 4 + 1
  });

  it("EOR (indirect,X), consumes 6 cycles", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_INDIRECT_X, 0x10]),
    );

    cpu.registers.A = 0b10101010;
    cpu.registers.X = 0x04;
    cpu.write(0x14, 0x00);
    cpu.write(0x15, 0x10);
    cpu.write(0x1000, 0b11111111);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b01010101);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("EOR (indirect),Y, consumes 5 cycles (+1 if page crossed)", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_INDIRECT_Y, 0x10]),
    );

    cpu.registers.A = 0b00001111;
    cpu.registers.Y = 0x01;

    cpu.write(0x10, 0x00);
    cpu.write(0x11, 0x10);
    cpu.write(0x1001, 0b11110000);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("EOR (indirect),Y adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.BITWISE_EXCLUSIVE_OR_INDIRECT_Y, 0x10]),
    );

    cpu.registers.A = 0b00001111;
    cpu.registers.Y = 0x01;

    // ponteiro -> 0x10FF
    cpu.write(0x10, 0xff);
    cpu.write(0x11, 0x10);

    // 0x10FF + 0x01 = 0x1100
    cpu.write(0x1100, 0b11110000);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.A).toBe(0b11111111);
    expect(cpu.cycles - initialCycles).toBe(6); // 5 + 1
  });
});
