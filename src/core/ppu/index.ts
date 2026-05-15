import { Cartridge } from "../cartridge";

export class PPU {
  private PPUSTATUS = 0x00;

  private addrLatch = 0;

  constructor(_cartridge: Cartridge) {}

  // ========================
  // CPU → PPU
  // ========================
  cpuRead(addr: number): number {
    addr &= 7;

    switch (addr) {
      case 2: {
        // PPUSTATUS
        const status = this.PPUSTATUS;

        // limpa VBlank (bit 7)
        this.PPUSTATUS &= 0x7f;

        // reseta latch
        this.addrLatch = 0;

        return status;
      }

      default:
        return 0;
    }
  }

  cpuWrite(addr: number, _data: number): void {
    addr &= 7;

    switch (addr) {
      case 0: // PPUCTRL
      case 1: // PPUMASK
      case 3: // OAMADDR
      case 4: // OAMDATA
      case 5: // PPUSCROLL
        // ignorado
        break;

      case 6: // PPUADDR
        // só precisa alternar latch
        this.addrLatch ^= 1;
        break;

      case 7: // PPUDATA
        // ignorado
        break;
    }
  }

  // ========================
  // DMA (obrigatório existir)
  // ========================
  writeOAM(_data: number): void {
    // não precisa fazer nada
  }
}
