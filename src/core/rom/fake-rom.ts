import { Rom } from "../rom";

const HEADER_SIZE = 16;
const PRG_BANK_SIZE = 16 * 1024;

export class FakeRom extends Rom {
  constructor(program: number[], start = 0x8000, irqVector?: number) {
    const prgBanks = 1; // 16KB
    const chrBanks = 0; // CHR RAM

    const header = new Uint8Array(HEADER_SIZE);

    header[0] = 0x4e;
    header[1] = 0x45;
    header[2] = 0x53;
    header[3] = 0x1a;

    header[4] = prgBanks;
    header[5] = chrBanks;

    header[6] = 0x00;
    header[7] = 0x00;

    const prgRom = new Uint8Array(PRG_BANK_SIZE);

    //  carregar programa
    const offset = start - 0x8000;
    prgRom.set(program, offset);

    // reset vector correto para 16KB
    const resetVector = 0x3ffc;
    prgRom[resetVector] = start & 0xff;
    prgRom[resetVector + 1] = (start >> 8) & 0xff;

    // IRQ/BRK vector (0xFFFE)
    if (irqVector !== undefined) {
      prgRom[0x3ffe] = irqVector & 0xff;
      prgRom[0x3fff] = (irqVector >> 8) & 0xff;
    }

    const raw = new Uint8Array([...header, ...prgRom]);

    super(raw);
  }
}
