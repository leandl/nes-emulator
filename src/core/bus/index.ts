import { Cartridge } from "../cartridge";
import { PPU } from "../ppu";

export class Bus {
  private cpuRam = new Uint8Array(2048);

  constructor(
    private cartridge: Cartridge,
    private ppu: PPU,
  ) {}

  // ========================
  // CPU READ
  // ========================
  cpuRead(addr: number): number {
    addr &= 0xffff;

    // RAM (espelhada)
    if (addr <= 0x1fff) {
      return this.cpuRam[addr & 0x07ff];
    }

    // PPU registers (espelhados)
    if (addr >= 0x2000 && addr <= 0x3fff) {
      return this.ppu.cpuRead(addr & 0x0007);
    }

    // APU / IO (stub por enquanto)
    if (addr >= 0x4000 && addr <= 0x4017) {
      return 0;
    }

    // Cartridge
    if (addr >= 0x4020) {
      return this.cartridge.cpuRead(addr);
    }

    return 0;
  }

  // ========================
  // CPU WRITE
  // ========================
  cpuWrite(addr: number, data: number): void {
    addr &= 0xffff;
    data &= 0xff;

    // RAM
    if (addr <= 0x1fff) {
      this.cpuRam[addr & 0x07ff] = data;
      return;
    }

    // PPU
    if (addr >= 0x2000 && addr <= 0x3fff) {
      this.ppu.cpuWrite(addr & 0x0007, data);
      return;
    }

    // DMA (IMPORTANTÍSSIMO)
    if (addr === 0x4014) {
      this.doDMA(data);
      return;
    }

    // APU / IO (stub)
    if (addr >= 0x4000 && addr <= 0x4017) {
      return;
    }

    // Cartridge
    if (addr >= 0x4020) {
      this.cartridge.cpuWrite(addr, data);
    }
  }

  // ========================
  // DMA (OAM transfer)
  // ========================
  private doDMA(page: number): void {
    const baseAddr = page << 8;

    for (let i = 0; i < 256; i++) {
      const data = this.cpuRead(baseAddr + i);
      this.ppu.writeOAM(data);
    }
  }
}
