import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("Illegal NOP instruction integration tests", () => {
  let cpu: CPU;

  function expectNOPBehavior(cpu: CPU, pcIncrement: number, cycles: number) {
    const initialCycles = cpu.cycles;

    const initialA = cpu.registers.A;
    const initialX = cpu.registers.X;
    const initialY = cpu.registers.Y;
    const initialStatus = cpu.registers.STATUS.raw;
    const initialPC = cpu.registers.PC;

    cpu.step();

    expect(cpu.registers.PC).toBe(initialPC + pcIncrement);
    expect(cpu.cycles - initialCycles).toBe(cycles);

    expect(cpu.registers.A).toBe(initialA);
    expect(cpu.registers.X).toBe(initialX);
    expect(cpu.registers.Y).toBe(initialY);
    expect(cpu.registers.STATUS.raw).toBe(initialStatus);
  }

  it("NOP immediate (0x80)", () => {
    cpu = createCPU(new FakeRom([Opcode.NO_OPERATION_IMMEDIATE, 0x12]));

    expectNOPBehavior(cpu, 2, 2);
  });

  it("NOP zero page variants", () => {
    const opcodes = [
      Opcode.NO_OPERATION_ZERO_PAGE_04,
      Opcode.NO_OPERATION_ZERO_PAGE_44,
      Opcode.NO_OPERATION_ZERO_PAGE_64,
    ];

    for (const opcode of opcodes) {
      cpu = createCPU(new FakeRom([opcode, 0x10]));
      expectNOPBehavior(cpu, 2, 3);
    }
  });

  it("NOP zero page,X variants", () => {
    const opcodes = [
      Opcode.NO_OPERATION_ZERO_X_14,
      Opcode.NO_OPERATION_ZERO_X_34,
      Opcode.NO_OPERATION_ZERO_X_54,
      Opcode.NO_OPERATION_ZERO_X_74,
      Opcode.NO_OPERATION_ZERO_X_D4,
      Opcode.NO_OPERATION_ZERO_X_F4,
    ];

    for (const opcode of opcodes) {
      cpu = createCPU(new FakeRom([opcode, 0x10]));
      cpu.registers.X = 0x05;

      expectNOPBehavior(cpu, 2, 4);
    }
  });

  it("NOP absolute", () => {
    cpu = createCPU(new FakeRom([Opcode.NO_OPERATION_ABSOLUTE, 0x00, 0x20]));

    expectNOPBehavior(cpu, 3, 4);
  });

  it("NOP absolute,X variants (no page cross)", () => {
    const opcodes = [
      Opcode.NO_OPERATION_ABSOLUTE_X_1C,
      Opcode.NO_OPERATION_ABSOLUTE_X_3C,
      Opcode.NO_OPERATION_ABSOLUTE_X_5C,
      Opcode.NO_OPERATION_ABSOLUTE_X_7C,
      Opcode.NO_OPERATION_ABSOLUTE_X_DC,
      Opcode.NO_OPERATION_ABSOLUTE_X_FC,
    ];

    for (const opcode of opcodes) {
      cpu = createCPU(new FakeRom([opcode, 0x00, 0x20]));
      cpu.registers.X = 0x01;

      expectNOPBehavior(cpu, 3, 4);
    }
  });

  it("NOP absolute,X adds 1 cycle when page is crossed", () => {
    cpu = createCPU(
      new FakeRom([Opcode.NO_OPERATION_ABSOLUTE_X_1C, 0xff, 0x20]),
    );

    cpu.registers.X = 0x01;

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("NOP implied illegal variants", () => {
    const opcodes = [
      Opcode.NO_OPERATION_1A,
      Opcode.NO_OPERATION_3A,
      Opcode.NO_OPERATION_5A,
      Opcode.NO_OPERATION_7A,
      Opcode.NO_OPERATION_DA,
      Opcode.NO_OPERATION_FA,
    ];

    for (const opcode of opcodes) {
      cpu = createCPU(new FakeRom([opcode]));
      expectNOPBehavior(cpu, 1, 2);
    }
  });
});
