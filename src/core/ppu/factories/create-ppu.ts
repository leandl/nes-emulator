import { Bus } from "../../bus";
import { Cartridge } from "../../cartridge";
import { CPU } from "../../cpu";
import { allInstructions } from "../../cpu/factories/instructions/all-instructions";
import { PPU } from "../../ppu";
import { allRegisters } from "../../ppu/factories/all-registers";
import { Rom } from "../../rom";
import { FakeRom } from "../../rom/fake-rom";

export function createCPUAndPPU(rom: Rom = new FakeRom([])): [CPU, PPU] {
  const cartridge = new Cartridge(rom);
  const ppu = new PPU(cartridge, allRegisters);
  const bus = new Bus(cartridge, ppu);

  const cpu = new CPU(bus, allInstructions);

  cpu.reset();

  return [cpu, ppu];
}
