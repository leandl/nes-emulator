import { PPUStatusFlag } from "./flag";

export class PPUStatus {
  private value = 0;

  // últimos 5 bits (open bus simulation simplificada)
  private lowBits = 0;

  get raw(): number {
    return (this.value & 0xe0) | (this.lowBits & 0x1f);
  }

  set raw(v: number) {
    this.value = v & 0xe0;
    this.lowBits = v & 0x1f;
  }

  // ========================
  // Flags
  // ========================

  private setFlag(flag: PPUStatusFlag, enabled: boolean) {
    if (enabled) {
      this.value |= flag;
    } else {
      this.value &= ~flag;
    }
  }

  is(flag: PPUStatusFlag): boolean {
    return (this.value & flag) !== 0;
  }

  // ========================
  // Eventos do PPU
  // ========================

  setVBlank() {
    this.setFlag(PPUStatusFlag.VBLANK, true);
  }

  clearVBlank() {
    this.setFlag(PPUStatusFlag.VBLANK, false);
  }

  setSpriteZeroHit() {
    this.setFlag(PPUStatusFlag.SPRITE_ZERO_HIT, true);
  }

  clearSpriteZeroHit() {
    this.setFlag(PPUStatusFlag.SPRITE_ZERO_HIT, false);
  }

  setSpriteOverflow() {
    this.setFlag(PPUStatusFlag.SPRITE_OVERFLOW, true);
  }

  clearSpriteOverflow() {
    this.setFlag(PPUStatusFlag.SPRITE_OVERFLOW, false);
  }

  // ========================
  // Leitura pelo CPU ($2002)
  // ========================

  read(): number {
    const result = this.raw;

    // leitura limpa VBlank
    this.clearVBlank();

    return result;
  }

  // ========================
  // Open bus (opcional)
  // ========================

  updateOpenBus(value: number) {
    this.lowBits = value & 0x1f;
  }

  reset() {
    this.value = 0;
    this.lowBits = 0;
  }
}
