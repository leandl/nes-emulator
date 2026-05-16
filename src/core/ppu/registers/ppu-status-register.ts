import { PPU } from "..";
import { Register } from "./register";

export class PPUStatusRegister implements Register {
  read(ppu: PPU): number {
    const value = ppu.status.read();

    // comportamento especial
    ppu.addrLatch = 0;

    return value;
  }

  write(_ppu: PPU, _data: number): void {
    // read-only
  }
}
