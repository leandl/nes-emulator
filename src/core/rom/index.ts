const NES_HEADER_MAGIC = [0x4e, 0x45, 0x53, 0x1a];

const HEADER_SIZE = 16;
const TRAINER_SIZE = 512;

const PRG_BANK_SIZE = 16 * 1024;
const CHR_BANK_SIZE = 8 * 1024;

export type Mirroring = "horizontal" | "vertical" | "four-screen";

export interface INesHeader {
  prgBanks: number;
  chrBanks: number;
  mapperId: number;

  hasTrainer: boolean;
  hasBattery: boolean;

  mirroring: Mirroring;
}

export class Rom {
  readonly prgRom: Uint8Array;
  readonly chrRom: Uint8Array;

  readonly mapperId: number;
  readonly mirroring: Mirroring;
  readonly hasBattery: boolean;
  readonly hasChrRam: boolean;

  constructor(private readonly rawData: Uint8Array) {
    this.validateHeader();

    const header = this.parseHeader();

    let offset = HEADER_SIZE;

    if (header.hasTrainer) {
      offset += TRAINER_SIZE;
    }

    this.prgRom = this.extractPrgRom(offset, header.prgBanks);
    offset += this.prgRom.length;

    this.hasChrRam = header.chrBanks === 0;
    this.chrRom = this.extractChrRom(offset, header.chrBanks);

    this.mapperId = header.mapperId;
    this.mirroring = header.mirroring;
    this.hasBattery = header.hasBattery;
  }

  private validateHeader(): void {
    const isValid = NES_HEADER_MAGIC.every(
      (byte, i) => this.rawData[i] === byte,
    );

    if (!isValid) {
      throw new Error("Invalid NES ROM");
    }
  }

  private parseHeader(): INesHeader {
    const prgBanks = this.rawData[4];
    const chrBanks = this.rawData[5];

    const flag6 = this.rawData[6];
    const flag7 = this.rawData[7];

    // Mapper (baixo + alto)
    const mapperId = (flag7 & 0xf0) | (flag6 >> 4);

    const hasTrainer = (flag6 & 0x04) !== 0;
    const hasBattery = (flag6 & 0x02) !== 0;

    // Mirroring
    let mirroring: Mirroring;

    if (flag6 & 0x08) {
      mirroring = "four-screen";
    } else if (flag6 & 0x01) {
      mirroring = "vertical";
    } else {
      mirroring = "horizontal";
    }

    return {
      prgBanks,
      chrBanks,
      mapperId,
      hasTrainer,
      hasBattery,
      mirroring,
    };
  }

  private extractPrgRom(offset: number, banks: number): Uint8Array {
    const size = banks * PRG_BANK_SIZE;

    if (offset + size > this.rawData.length) {
      throw new Error("PRG ROM out of bounds");
    }

    return this.rawData.slice(offset, offset + size);
  }

  private extractChrRom(offset: number, banks: number): Uint8Array {
    const size = banks * CHR_BANK_SIZE;

    if (size === 0) {
      // CHR RAM
      return new Uint8Array(CHR_BANK_SIZE);
    }

    if (offset + size > this.rawData.length) {
      throw new Error("CHR ROM out of bounds");
    }

    return this.rawData.slice(offset, offset + size);
  }
}
