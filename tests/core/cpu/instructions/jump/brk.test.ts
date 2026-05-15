import { CPU } from "../../../../../src/core/cpu";
import { CPUStatus } from "../../../../../src/core/cpu/cpu-status";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Flag } from "../../../../../src/core/cpu/flag";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { Stack } from "../../../../../src/core/cpu/stack";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("BRK instruction integration tests", () => {
  let cpu: CPU;

  it("BRK pushes PC+2 and jumps to IRQ vector, consumes 7 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.BREAK], 0x8000, 0x9000));

    const initialSP = cpu.registers.SP;
    const initialCycles = cpu.cycles;

    cpu.step();
    console.log(cpu.registers.PC.toString(16));

    // verifica jump
    expect(cpu.registers.PC).toBe(0x9000);

    // verifica stack (PC+2)
    const flags = Stack.pull(cpu);
    const low = Stack.pull(cpu);
    const high = Stack.pull(cpu);

    const returnAddress = (high << 8) | low;

    expect(returnAddress).toBe(0x8002); // BRK considerado 2 bytes

    // SP restaurado após pull manual
    expect(cpu.registers.SP).toBe(initialSP);

    expect(cpu.cycles - initialCycles).toBe(7);

    const oldStatus = new CPUStatus(flags);
    const newStatus = cpu.registers.STATUS;

    // flags empilhadas têm B=1
    expect(oldStatus.is(Flag.BREAK)).toBe(true);
    expect(newStatus.is(Flag.INTERRUPT_DISABLE)).toBe(true);
  });

  it("BRK sets interrupt disable flag", () => {
    cpu = createCPU(new FakeRom([Opcode.BREAK]));

    cpu = createCPU(new FakeRom([Opcode.BREAK], 0x8000, 0x9000));

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(true);
  });

  it("BRK pushes flags with BREAK and UNUSED set", () => {
    cpu = createCPU(new FakeRom([Opcode.BREAK]));

    cpu = createCPU(new FakeRom([Opcode.BREAK], 0x8000, 0x9000));

    cpu.step();

    const flags = Stack.pull(cpu);
    const oldStatus = new CPUStatus(flags);

    expect(oldStatus.is(Flag.UNUSED)).toBe(true);
    expect(oldStatus.is(Flag.BREAK)).toBe(true);
  });

  it("BRK pushes PC high then low (stack order correctness)", () => {
    cpu = createCPU(new FakeRom([Opcode.BREAK]));

    cpu = createCPU(new FakeRom([Opcode.BREAK], 0x8000, 0x9000));

    cpu.step();

    Stack.pull(cpu); // flag
    const low = Stack.pull(cpu);
    const high = Stack.pull(cpu);

    expect(high).toBe(0x80);
    expect(low).toBe(0x02);
  });

  it("BRK integrates correctly with RTI (round trip)", () => {
    const program = new Array(0x1000).fill(0x00); // espaço até 0x9000

    // 0x8000: BRK
    // 0x9000: RTI
    program[0x0000] = Opcode.BREAK; // 0x8000
    program[0x1000 - 1] = 0x00; // padding opcional
    program[0x1000] = Opcode.RETURN_FROM_INTERRUPT; // 0x9000

    cpu = createCPU(new FakeRom(program, 0x8000, 0x9000));

    const initialSP = cpu.registers.SP;

    cpu.step(); // BRK
    expect(cpu.registers.PC).toBe(0x9000);
    expect(cpu.registers.SP).toBe(initialSP - 3);

    cpu.step(); // RTI

    // // volta para PC original +2
    expect(cpu.registers.PC).toBe(0x8002);
    expect(cpu.registers.SP).toBe(initialSP);
  });
});
