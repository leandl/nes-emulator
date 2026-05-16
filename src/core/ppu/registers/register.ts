import { PPU } from "..";

export interface Register {
  read(ppu: PPU): number;
  write(ppu: PPU, data: number): void;
}
