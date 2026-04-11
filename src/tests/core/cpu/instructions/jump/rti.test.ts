import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";
import { Stack } from "../../../../../core/cpu/stack";
import { Flag } from "../../../../../core/cpu/flag";

describe("RTI instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("RTI pulls flags and PC correctly, consumes 6 cycles", () => {
    const initialSP = cpu.registers.SP;
    const initialCycles = cpu.cycles;

    // simula estado salvo (igual interrupção real)
    Stack.push(cpu, 0x12); // HIGH
    Stack.push(cpu, 0x34); // LOW
    Stack.push(cpu, 0b10101010); // FLAGS

    cpu.loadProgram([Opcode.RETURN_FROM_INTERRUPT]);

    cpu.step();

    // PC restaurado exatamente (sem +1)
    expect(cpu.registers.PC).toBe(0x1234);

    // SP restaurado
    expect(cpu.registers.SP).toBe(initialSP);

    // ciclos
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RTI restores flags correctly (ignores BREAK, forces UNUSED)", () => {
    // BREAK = 1 (deve ser ignorado)
    const flags = Flag.CARRY | Flag.BREAK | Flag.ZERO;

    Stack.push(cpu, 0x00); // HIGH
    Stack.push(cpu, 0x80); // LOW
    Stack.push(cpu, flags);

    cpu.loadProgram([Opcode.RETURN_FROM_INTERRUPT]);

    cpu.step();

    const status = cpu.registers.STATUS;

    expect(status.is(Flag.CARRY)).toBe(true);
    expect(status.is(Flag.ZERO)).toBe(true);

    // BREAK não existe internamente
    expect(status.is(Flag.BREAK)).toBe(false);

    // UNUSED sempre 1
    expect(status.is(Flag.UNUSED)).toBe(true);
  });

  it("RTI restores interrupt flag immediately", () => {
    // garante que I começa como true
    cpu.registers.STATUS.setFlag(Flag.INTERRUPT_DISABLE, true);

    // stack com I = 0
    const flags = 0x00;

    Stack.push(cpu, 0x00); // HIGH
    Stack.push(cpu, 0x80); // LOW
    Stack.push(cpu, flags);

    cpu.loadProgram([Opcode.RETURN_FROM_INTERRUPT]);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(false);
  });

  it("RTI pulls PC in correct order (low then high)", () => {
    Stack.push(cpu, 0xab); // HIGH
    Stack.push(cpu, 0xcd); // LOW
    Stack.push(cpu, 0x00); // FLAGS

    cpu.loadProgram([Opcode.RETURN_FROM_INTERRUPT]);

    cpu.step();

    expect(cpu.registers.PC).toBe(0xabcd);
  });

  it("BRK + RTI integration returns to correct address", () => {
    // vetor IRQ → 0x9000
    cpu.memory.write(0xfffe, 0x00);
    cpu.memory.write(0xffff, 0x90);

    // 0x8000: BRK
    // 0x9000: RTI
    cpu.loadProgram([Opcode.BREAK], 0x8000);
    cpu.memory.write(0x9000, Opcode.RETURN_FROM_INTERRUPT);

    const initialSP = cpu.registers.SP;

    cpu.step(); // BRK
    expect(cpu.registers.PC).toBe(0x9000);
    expect(cpu.registers.SP).toBe(initialSP - 3);

    cpu.step(); // RTI

    // volta para próxima instrução (PC + 2 do BRK)
    expect(cpu.registers.PC).toBe(0x8002);
    expect(cpu.registers.SP).toBe(initialSP);
  });
});
