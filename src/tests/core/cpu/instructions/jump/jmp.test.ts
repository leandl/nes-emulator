import { CPU } from "../../../../../core/cpu";
import { createCPU } from "../../../../../core/cpu/factories/create-cpu";
import { Opcode } from "../../../../../core/cpu/opcode";
import { FakeRom } from "../../../../../core/rom/fake-rom";

describe("JMP instruction integration tests", () => {
  let cpu: CPU;

  it("JMP absolute sets PC correctly, consumes 3 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.JUMP_ABSOLUTE, 0x00, 0x90])); // JMP $9000
    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(0x9000);
    expect(cpu.cycles - initialCycles).toBe(3);
  });

  it("JMP indirect sets PC correctly, consumes 5 cycles", () => {
    cpu = createCPU(new FakeRom([Opcode.JUMP_INDIRECT, 0x00, 0x10])); // JMP ($3000)

    // endereço indireto aponta para 0x4000
    cpu.write(0x1000, 0x00); // low
    cpu.write(0x1001, 0x40); // high

    const initialCycles = cpu.cycles;

    cpu.step();

    expect(cpu.registers.PC).toBe(0x4000);
    expect(cpu.cycles - initialCycles).toBe(5);
  });

  it("JMP indirect emulates page boundary bug ($xxFF)", () => {
    cpu = createCPU(new FakeRom([Opcode.JUMP_INDIRECT, 0xff, 0x03])); // JMP ($03FF)

    // comportamento bugado:
    // low byte vem de 0x03FF
    // high byte vem de 0x0300 (não 0x0400)
    cpu.write(0x03ff, 0x00); // low
    cpu.write(0x0300, 0x80); // high errado por causa do bug

    const initialCycles = cpu.cycles;

    cpu.step();

    // endereço esperado: 0x8000 (0x80 << 8 | 0x00)
    expect(cpu.registers.PC).toBe(0x8000);
    expect(cpu.cycles - initialCycles).toBe(5);
  });
});
