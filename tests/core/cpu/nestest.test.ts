import fs from "fs";
import path from "path";
import readline from "readline";
import { Rom } from "../../../src/core/rom";
import { CPURegister } from "../../../src/core/cpu/registers";
import { createCPU } from "../../../src/core/cpu/factories/create-cpu";

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

    const cpu = createCPU(rom);

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

      expect(actual.pc).toBe(expected.pc);
      expect(actual.a).toBe(expected.a);
      expect(actual.x).toBe(expected.x);
      expect(actual.y).toBe(expected.y);
      expect(actual.sp).toBe(expected.sp);
      expect(actual.p).toBe(expected.p);
      expect(cpu.cycles).toBe(expected.cycles);

      cpu.step();
    }
  });
});
