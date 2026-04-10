import { CPU } from "../../../../../core/cpu";
import { allInstruction } from "../../../../../core/cpu/factories/instructions/all-instructions";
import { Opcode } from "../../../../../core/cpu/opcode";

describe("JSR instruction integration tests", () => {
  let cpu: CPU;

  beforeEach(() => {
    cpu = new CPU(allInstruction);
  });

  it("JSR pushes return address to stack and jumps, consumes 6 cycles", () => {
    const initialProgram = 0x8000;
    cpu.loadProgram([Opcode.JUMP_TO_SUBROUTINE, 0x00, 0x30], initialProgram); // JSR $3000

    const initialSP = cpu.registers.SP;
    const initialCycles = cpu.cycles;

    cpu.step();

    // PC deve ir para o destino
    expect(cpu.registers.PC).toBe(0x3000);

    // Stack deve ter dois bytes
    expect(cpu.registers.SP).toBe(initialSP - 2);

    // endereço de retorno esperado = PC inicial + 2
    // como PC começa no opcode, isso vira 0x8002
    const returnLow = cpu.memory.read(0x0100 + initialSP - 1);
    const returnHigh = cpu.memory.read(0x0100 + initialSP);

    const returnAddress = (returnHigh << 8) | returnLow;

    expect(returnAddress).toBe(initialProgram + 2);

    expect(cpu.cycles - initialCycles).toBe(6);
  });

  it("JSR stores correct return address for non-zero start PC", () => {
    cpu.registers.PC = 0x8000;
    cpu.memory.write(0x8000, Opcode.JUMP_TO_SUBROUTINE);
    cpu.memory.write(0x8001, 0x00);
    cpu.memory.write(0x8002, 0x40); // JSR $4000

    const initialSP = cpu.registers.SP;

    cpu.step();

    expect(cpu.registers.PC).toBe(0x4000);

    const returnLow = cpu.memory.read(0x0100 + initialSP - 1);
    const returnHigh = cpu.memory.read(0x0100 + initialSP);

    const returnAddress = (returnHigh << 8) | returnLow;

    // 0x8000 + 2
    expect(returnAddress).toBe(0x8002);
  });

  it("JSR pushes HIGH byte first, then LOW byte", () => {
    cpu.registers.PC = 0x1234;
    cpu.memory.write(0x1234, Opcode.JUMP_TO_SUBROUTINE);
    cpu.memory.write(0x1235, 0x00);
    cpu.memory.write(0x1236, 0x20); // JSR $2000

    const initialSP = cpu.registers.SP;

    cpu.step();

    const high = cpu.memory.read(0x0100 + initialSP);
    const low = cpu.memory.read(0x0100 + initialSP - 1);

    expect(high).toBe(0x12); // HIGH de 0x1236
    expect(low).toBe(0x36); // LOW de 0x1236
  });
});
