import { PPU } from "..";
import { Register } from "./register";

export class PPUAddrRegister implements Register {
  read(_ppu: PPU): number {
    // leitura não é usada no NES
    return 0;
  }

  write(ppu: PPU, data: number): void {
    if (ppu.addrLatch === 0) {
      // primeira escrita -> high byte (6 bits)
      ppu.tempAddr = (data & 0x3f) << 8;
      ppu.addrLatch = 1;
    } else {
      // segunda escrita -> low byte
      ppu.tempAddr |= data;

      // copia para endereço real
      ppu.vramAddr = ppu.tempAddr;

      // reseta latch
      ppu.addrLatch = 0;
    }
  }
}
