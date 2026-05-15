import { Mapper } from "./mapper";

// Mapper 000 (NROM)
export class Mapper000 implements Mapper {
  constructor(
    private prgRom: Uint8Array,
    private chr: Uint8Array,
    private hasChrRam: boolean,
  ) {}

  cpuRead(addr: number): number {
    if (addr >= 0x8000) {
      let mapped = addr - 0x8000;

      if (this.prgRom.length === 0x4000) {
        mapped &= 0x3fff;
      }

      return this.prgRom[mapped];
    }

    return 0;
  }

  cpuWrite(_addr: number, _data: number): void {
    // NROM não escreve
  }

  ppuRead(addr: number): number {
    if (addr < 0x2000) {
      return this.chr[addr];
    }
    return 0;
  }

  ppuWrite(addr: number, data: number): void {
    if (addr < 0x2000 && this.hasChrRam) {
      this.chr[addr] = data;
    }
  }
}
