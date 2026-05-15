import { CPU } from "../../../../../src/core/cpu";
import { createCPU } from "../../../../../src/core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../src/core/cpu/opcode";
import { Stack } from "../../../../../src/core/cpu/stack";
import { FakeRom } from "../../../../../src/core/rom/fake-rom";

describe("JSR instruction integration tests", () => {
  let cpu: CPU;

  it("JSR pushes return address to stack and jumps, consumes 6 cycles", () => {
    const initialProgram = 0x8000;
    cpu = createCPU(
      new FakeRom(
        [
          // JSR $9000
          Opcode.JUMP_TO_SUBROUTINE,
          0x00,
          0x90,
        ],
        initialProgram,
      ),
    );

    const initialSP = cpu.registers.SP;
    const initialCycles = cpu.cycles;

    cpu.step();

    // PC deve ir para o destino
    expect(cpu.registers.PC).toBe(0x9000);

    // Stack deve ter dois bytes
    expect(cpu.registers.SP).toBe(initialSP - 2);

    const returnLow = Stack.pull(cpu);
    const returnHigh = Stack.pull(cpu);

    const returnAddress = (returnHigh << 8) | returnLow;

    expect(returnAddress).toBe(initialProgram + 2);

    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("JSR stores correct return address for non-zero start PC", () => {
    cpu = createCPU(
      new FakeRom([
        // JSR $4000
        Opcode.JUMP_TO_SUBROUTINE,
        0x00,
        0x40,
      ]),
    );

    cpu.step();

    expect(cpu.registers.PC).toBe(0x4000);

    const returnLow = Stack.pull(cpu);
    const returnHigh = Stack.pull(cpu);

    const returnAddress = (returnHigh << 8) | returnLow;

    // 0x8000 + 2
    expect(returnAddress).toBe(0x8002);
  });

  it("JSR pushes HIGH byte first, then LOW byte", () => {
    cpu = createCPU(
      new FakeRom(
        [
          // JSR $2000
          Opcode.JUMP_TO_SUBROUTINE,
          0x00,
          0x20,
        ],
        0x8050,
      ),
    );

    cpu.step();

    const low = Stack.pull(cpu);
    const high = Stack.pull(cpu);

    expect(high).toBe(0x80); // HIGH de 0x8052
    expect(low).toBe(0x52); // LOW de 0x8052
  });
});
