import { Rom } from "../rom";
import { Mapper } from "./mapper";
import { Mapper000 } from "./mapper000";
import { Mapper002 } from "./mapper002";

export function createMapper(rom: Rom): Mapper {
  switch (rom.mapperId) {
    case 0:
      return new Mapper000(rom.prgRom, rom.chrRom, rom.hasChrRam);

    case 2:
      return new Mapper002(rom.prgRom, rom.chrRom, rom.hasChrRam);

    default:
      throw new Error(`Mapper ${rom.mapperId} not supported`);
  }
}
