import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("ROL instruction integration tests", () => {
  let cpu: CPU;

  it("ROL accumulator shifts left through carry and consumes 2 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ACCUMULATOR]));

    cpu.registers.A = 0x40;
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.registers.A).toBe(0x80);
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ROL accumulator with carry true rotates carry into bit 0", () => {
    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ACCUMULATOR]));

    cpu.registers.A = 0x40; // 01000000
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    // esperado:
    // shift: 10000000
    // carry entra no bit0 -> 10000001 (0x81)
    expect(cpu.registers.A).toBe(0x81);
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false); // bit7 original era 0
    expect(cpu.cycles - initialCycles).toBe(2);
  });

  it("ROL zero page shifts memory correctly, consumes 5 cycles", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ZERO_PAGE, addr]));

    cpu.write(addr, 0x20);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x40);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ROL zero page with carry true rotates correctly", () => {
    const addr = 0x10;

    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ZERO_PAGE, addr]));

    cpu.write(addr, 0x20); // 00100000
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(addr)).toBe(0x41); // 01000001
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("ROL zero page,X uses X offset, consumes 6 cycles", () => {
    const base = 0x10;

    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ZERO_PAGE_X, base]));

    cpu.registers.X = 0x05;
    cpu.write(base + 0x05, 0x01);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(base + 0x05)).toBe(0x02);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL zero page,X with carry true rotates correctly", () => {
    const base = 0x10;

    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ZERO_PAGE_X, base]));

    cpu.registers.X = 0x05;
    cpu.write(base + 0x05, 0x01); // 00000001
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(base + 0x05)).toBe(0x03); // 00000011
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL absolute shifts memory correctly, consumes 6 cycles", () => {
    const addr = 0x1234;

    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ABSOLUTE, 0x34, 0x12]));

    cpu.write(addr, 0x11);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(addr)).toBe(0x22);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL absolute with carry true rotates correctly", () => {
    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ABSOLUTE, 0x34, 0x12]));

    const addr = 0x1234;

    cpu.write(addr, 0x11); // 00010001
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(addr)).toBe(0x23); // 00100011
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("ROL absolute,X uses X offset, consumes 7 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ABSOLUTE_X, 0x00, 0x01]));

    const base = 0x0100;
    cpu.registers.X = 0x02;
    cpu.write(base + 0x02, 0x02);
    cpu.registers.STATUS.setFlag(Flag.CARRY, false);

    const initialCycles = cpu.cycles;
    cpu.step();

    expect(cpu.read(base + 0x02)).toBe(0x04);
    expect(cpu.cycles - initialCycles).toBe(7);
  });

  it("ROL absolute,X with carry true rotates correctly", () => {
    cpu = createCPU(new FakeRom([Opcode.ROTATE_LEFT_ABSOLUTE_X, 0x00, 0x01]));

    const base = 0x0100;
    cpu.registers.X = 0x02;
    cpu.write(base + 0x02, 0x02); // 00000010
    cpu.registers.STATUS.setFlag(Flag.CARRY, true);

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.read(base + 0x02)).toBe(0x05); // 00000101
    expect(cpu.registers.STATUS.is(Flag.CARRY)).toBe(false);
    expect(cpu.cycles - initialCycles).toBe(7);
  });
});
