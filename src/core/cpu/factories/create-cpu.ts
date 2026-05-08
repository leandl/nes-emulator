import { CPU } from "..";
import { Bus } from "../../bus";
import { Cartridge } from "../../cartridge";
import { PPU } from "../../ppu";
import { Rom } from "../../rom";
import { allInstructions } from "./instructions/all-instructions";

export function createCPU(
  rom: Rom,
  startRegisters?: Partial<CPU["registers"]>,
): CPU {
  const cartridge = new Cartridge(rom);
  const ppu = new PPU(cartridge);
  const bus = new Bus(cartridge, ppu);

  const cpu = new CPU(bus, allInstructions);

  cpu.reset();

  if (startRegisters) {
    Object.assign(cpu.registers, startRegisters);
  }

  return cpu;
}
