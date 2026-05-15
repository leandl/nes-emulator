import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { Stack } from "../../../../../core/cpu/stack";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("RTS instruction integration tests", () => {
  let cpu: CPU;

  it("RTS pulls return address from stack and jumps, consumes 6 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_SUBROUTINE]));

    const initialSP = cpu.registers.SP;

    // simula endereço 0x3000 na stack
    Stack.push(cpu, 0x30); // HIGH
    Stack.push(cpu, 0x00); // LOW

    const initialCycles = cpu.cycles;

    cpu.step();

    // RTS faz +1 no endereço
    expect(cpu.registers.PC).toBe(0x3001);

    expect(cpu.registers.SP).toBe(initialSP);
    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("RTS correctly reconstructs address (low then high)", () => {
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_SUBROUTINE]));

    Stack.push(cpu, 0x12); // HIGH
    Stack.push(cpu, 0x34); // LOW

    cpu.step();

    expect(cpu.registers.PC).toBe(0x1235); // +1
  });

  it("RTS restores SP correctly after pull", () => {
    cpu = createCPU(new FakeRom([Opcode.RETURN_FROM_SUBROUTINE]));

    const initialSP = cpu.registers.SP;

    Stack.push(cpu, 0xaa); // HIGH
    Stack.push(cpu, 0xbb); // LOW

    const spAfterPush = cpu.registers.SP;

    cpu.step();

    expect(cpu.registers.SP).toBe(initialSP);
    expect(cpu.registers.SP).toBe(spAfterPush + 2);
  });

  it("JSR + RTS integration returns to next instruction", () => {
    const initialProgram = 0x8000;
    // Layout real:
    // 0x8000: JSR $0004
    // 0x8003: NOP (deve voltar aqui)
    // 0x8004: RTS

    cpu = createCPU(
      new FakeRom(
        [
          /*0x8000*/ Opcode.JUMP_TO_SUBROUTINE,
          0x04,
          0x80, // JSR $8004
          /*0x8003*/ Opcode.NO_OPERATION,
          /*0x8004*/ Opcode.RETURN_FROM_SUBROUTINE,
        ],
        initialProgram,
      ),
    );

    const initialSP = cpu.registers.SP;

    cpu.step(); // JSR
    expect(cpu.registers.PC).toBe(0x8004);
    expect(cpu.registers.SP).toBe(initialSP - 2); // validando push

    cpu.step(); // RTS
    expect(cpu.read(cpu.registers.PC)).toBe(Opcode.NO_OPERATION);
    expect(cpu.registers.PC).toBe(0x8003); // volta pro NOP
    expect(cpu.registers.SP).toBe(initialSP); // validando pull
  });
});
