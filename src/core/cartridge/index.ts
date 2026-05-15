import { createMapper } from "../mapper";
import { Mapper } from "../mapper/mapper";
import { Rom } from "../rom";

export class Cartridge {
  private mapper: Mapper;

  constructor(rom: Rom) {
    this.mapper = createMapper(rom);
  }

  cpuRead(addr: number): number {
    return this.mapper.cpuRead(addr);
  }

  cpuWrite(addr: number, data: number): void {
    this.mapper.cpuWrite(addr, data);
  }

  ppuRead(addr: number): number {
    return this.mapper.ppuRead(addr);
  }

  ppuWrite(addr: number, data: number): void {
    this.mapper.ppuWrite(addr, data);
  }
}
