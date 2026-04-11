import { CPU } from "../../../../../core/cpu";
import { CPUStatus } from "../../../../../core/cpu/cpu-status";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Flag } from "../../../../../core/cpu/flag";
import { Opcode } from "../../../../../core/cpu/opcode";
import { Stack } from "../../../../../core/cpu/stack";

describe("BRK instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  function setIRQVector(cpu: CPU, address: number) {
    cpu.memory.write(0xfffe, address & 0xff); // low
    cpu.memory.write(0xffff, (address >> 8) & 0xff); // high
  }

  it("BRK pushes PC+2 and jumps to IRQ vector, consumes 7 cycles", () => {
    setIRQVector(cpu, 0x9000);

    cpu.loadProgram([Opcode.BREAK]);

    const initialSP = cpu.registers.SP;
    const initialCycles = cpu.cycles;

    cpu.step();

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
    setIRQVector(cpu, 0x9000);

    cpu.loadProgram([Opcode.BREAK]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(true);
  });

  it("BRK pushes flags with BREAK and UNUSED set", () => {
    setIRQVector(cpu, 0x9000);

    cpu.loadProgram([Opcode.BREAK]);

    cpu.step();

    const flags = Stack.pull(cpu);
    const oldStatus = new CPUStatus(flags);

    expect(oldStatus.is(Flag.UNUSED)).toBe(true);
    expect(oldStatus.is(Flag.BREAK)).toBe(true);
  });

  it("BRK pushes PC high then low (stack order correctness)", () => {
    setIRQVector(cpu, 0x9000);

    cpu.loadProgram([Opcode.BREAK]);

    cpu.step();

    Stack.pull(cpu); // flag
    const low = Stack.pull(cpu);
    const high = Stack.pull(cpu);

    expect(high).toBe(0x80);
    expect(low).toBe(0x02);
  });

  it("BRK integrates correctly with RTI (round trip)", () => {
    setIRQVector(cpu, 0x9000);

    // 0x8000: BRK
    // 0x9000: RTI
    cpu.loadProgram([Opcode.BREAK], 0x8000);
    cpu.memory.write(0x9000, Opcode.RETURN_FROM_INTERRUPT);

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
