import { CPU } from "../../../../../core/cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { Stack } from "../../../../../core/cpu/stack";
import { Flag } from "../../../../../core/cpu/flag";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("RTI instruction integration tests", () => {
  let cpu: CPU;

  it("RTI pulls flags and PC correctly, consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_INTERRUPT]));

    const initialSP = cpu.registers.SP;
    const initialCycles = cpu.cycles;

    // simula estado salvo (igual interrupção real)
    Stack.push(cpu, 0x12); // HIGH
    Stack.push(cpu, 0x34); // LOW
    Stack.push(cpu, 0b10101010); // FLAGS

    cpu.step();

    // PC restaurado exatamente (sem +1)
    expect(cpu.registers.PC).toBe(0x1234);

    // SP restaurado
    expect(cpu.registers.SP).toBe(initialSP);

    // ciclos
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RTI restores flags correctly (ignores BREAK, forces UNUSED)", () => {
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_INTERRUPT]));

    // BREAK = 1 (deve ser ignorado)
    const flags = Flag.CARRY | Flag.BREAK | Flag.ZERO;

    Stack.push(cpu, 0x00); // HIGH
    Stack.push(cpu, 0x80); // LOW
    Stack.push(cpu, flags);

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
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_INTERRUPT]));

    // garante que I começa como true
    cpu.registers.STATUS.setFlag(Flag.INTERRUPT_DISABLE, true);

    // stack com I = 0
    const flags = 0x00;

    Stack.push(cpu, 0x00); // HIGH
    Stack.push(cpu, 0x80); // LOW
    Stack.push(cpu, flags);

    cpu.step();

    expect(cpu.registers.STATUS.is(Flag.INTERRUPT_DISABLE)).toBe(false);
  });

  it("RTI pulls PC in correct order (low then high)", () => {
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_INTERRUPT]));

    Stack.push(cpu, 0xab); // HIGH
    Stack.push(cpu, 0xcd); // LOW
    Stack.push(cpu, 0x00); // FLAGS

    cpu.step();

    expect(cpu.registers.PC).toBe(0xabcd);
  });

  it("BRK + RTI integration returns to correct address", () => {
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
    expect(cpu.read(0x9000)).toBe(Opcode.RETURN_FROM_INTERRUPT);

    cpu.step(); // RTI

    // volta para próxima instrução (PC + 2 do BRK)
    expect(cpu.registers.PC).toBe(0x8002);
    expect(cpu.registers.SP).toBe(initialSP);
  });
});
