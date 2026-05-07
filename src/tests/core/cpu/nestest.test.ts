import fs from "fs";
import path from "path";
import readline from "readline";
import { Rom } from "../../../core/rom";
import { allInstruction } from "../../../core/cpu/factories/instructions/all-instructions";
import { Cartridge } from "../../../core/cartridge";
import { PPU } from "../../../core/ppu";
import { Bus } from "../../../core/bus";
import { CPU } from "../../../core/cpu";
import { CPURegister } from "../../../core/cpu/registers";
// import { Cpu } from "../../../core/cpu"; // futuramente

const romPath = path.resolve(__dirname, "nestest.nes");
const logPath = path.resolve(__dirname, "nestest.log");

function createLineReader(filePath: string) {
  return readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });
}

export type NestestState = {
  pc: number;
  a: number;
  x: number;
  y: number;
  p: number;
  sp: number;
  cycles: number;
};

export function parseNestestLine(line: string): NestestState {
  const pc = parseInt(line.slice(0, 4), 16);

  const a = parseInt(line.match(/A:([0-9A-F]{2})/)![1], 16);
  const x = parseInt(line.match(/X:([0-9A-F]{2})/)![1], 16);
  const y = parseInt(line.match(/Y:([0-9A-F]{2})/)![1], 16);
  const p = parseInt(line.match(/P:([0-9A-F]{2})/)![1], 16);
  const sp = parseInt(line.match(/SP:([0-9A-F]{2})/)![1], 16);

  const cycles = parseInt(line.match(/CYC:(\d+)/)![1], 10);

  return { pc, a, x, y, p, sp, cycles };
}

describe("NESTest", () => {
  let rom: Rom;

  beforeAll(() => {
    const romRaw = fs.readFileSync(romPath);
    rom = new Rom(romRaw);
  });

  it("should load ROM correctly", () => {
    expect(rom.prgRom.length).toBeGreaterThan(0);
    expect(rom.mapperId).toBeDefined();
  });

  it("should parse log file", async () => {
    const rl = createLineReader(logPath);

    let lineCount = 0;

    for await (const line of rl) {
      expect(line.trim().length).toBeGreaterThan(0);
      lineCount++;
    }

    expect(lineCount).toBeGreaterThan(0);
  });

  it("should match CPU execution with nestest log", async () => {
    const rl = createLineReader(logPath);

    const cartridge = new Cartridge(rom);
    const ppu = new PPU(cartridge);
    const bus = new Bus(cartridge, ppu);

    const cpu = new CPU(bus, allInstruction);

    cpu.cycles = 7;
    cpu.registers[CPURegister.PROGRAM_COUNTER] = 0xc000;

    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;

      const expected = parseNestestLine(line);

      const actual = {
        pc: cpu.registers[CPURegister.PROGRAM_COUNTER],
        a: cpu.registers.A,
        x: cpu.registers.X,
        y: cpu.registers.Y,
        sp: cpu.registers[CPURegister.STACK_POINTER],
        p: cpu.registers.STATUS.raw,
      };

      try {
        expect(actual.pc).toBe(expected.pc);
        expect(actual.a).toBe(expected.a);
        expect(actual.x).toBe(expected.x);
        expect(actual.y).toBe(expected.y);
        expect(actual.sp).toBe(expected.sp);
        expect(actual.p).toBe(expected.p);
        expect(cpu.cycles).toBe(expected.cycles);

        if (lineNumber === 5200) {
          break;
        }

        cpu.step();
      } catch (err) {
        const opcode = cpu.read(actual.pc);

        console.error(
          `❌ NESTEST MISMATCH | ` +
            `line=${lineNumber} | ` +
            `pc=0x${actual.pc.toString(16).padStart(4, "0")} | ` +
            `opcode=0x${opcode.toString(16).padStart(2, "0")} | ` +
            `cycles=${cpu.cycles} expectedCycles=${expected.cycles} | ` +
            `expected={pc:0x${expected.pc.toString(16)},A:${expected.a.toString(16)},X:${expected.x.toString(16)},Y:${expected.y.toString(16)},SP:${expected.sp.toString(16)},P:${expected.p.toString(16)}} | ` +
            `actual={pc:0x${actual.pc.toString(16)},A:${actual.a.toString(16)},X:${actual.x.toString(16)},Y:${actual.y.toString(16)},SP:${actual.sp.toString(16)},P:${actual.p.toString(16)}} | ` +
            `log="${line.trim()}"`,
        );
        throw err;
      }
    }
  });
});
