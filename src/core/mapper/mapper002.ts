import { Mapper } from "./mapper";

// Mapper 002 (UxROM)
export class Mapper002 implements Mapper {
  private bankSelect = 0;

  constructor(
    private prgRom: Uint8Array,
    private chr: Uint8Array,
    private hasChrRam: boolean,
  ) {}

  cpuRead(addr: number): number {
    if (addr >= 0x8000 && addr <= 0xbfff) {
      const offset = this.bankSelect * 0x4000;
      return this.prgRom[offset + (addr & 0x3fff)];
    }

    if (addr >= 0xc000) {
      // último banco fixo
      const offset = this.prgRom.length - 0x4000;
      return this.prgRom[offset + (addr & 0x3fff)];
    }

    return 0;
  }

  cpuWrite(addr: number, data: number): void {
    if (addr >= 0x8000) {
      this.bankSelect = data & 0x0f;
    }
  }

  ppuRead(addr: number): number {
    return this.chr[addr];
  }

  ppuWrite(addr: number, data: number): void {
    if (this.hasChrRam) {
      this.chr[addr] = data;
    }
  }
}
