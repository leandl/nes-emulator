import { Flag } from "./flag";

export class CPUStatus {
  private value: number = Flag.INTERRUPT_DISABLE | Flag.UNUSED; // valor inicial padrão do NES

  constructor(initialStatus?: number) {
    if (initialStatus !== undefined) {
      this.value = initialStatus;
    }
  }

  get raw() {
    return this.value;
  }

  set raw(v: number) {
    this.value = v & 0xff;
  }

  getForStackPush(): number {
    // limpa BREAK e UNUSED do estado interno
    const base = this.value & ~(Flag.BREAK | Flag.UNUSED);

    // força ambos como 1 [PHP behavior (NV1BDIZC)]
    return base | Flag.BREAK | Flag.UNUSED;
  }

  setFromStackPull(value: number): void {
    // Remove BREAK (bit 4) e UNUSED (bit 5)
    // e força UNUSED = 1 internamente
    this.value = (value & ~Flag.BREAK) | Flag.UNUSED;
  }

  setFlag(flag: Flag, enabled: boolean) {
    if (enabled) {
      this.value |= flag;
    } else {
      this.value &= ~flag;
    }
  }

  is(flag: Flag): boolean {
    return (this.value & flag) !== 0;
  }

  updateZeroAndNegative(value: number) {
    this.setFlag(Flag.ZERO, value === 0);
    this.setFlag(Flag.NEGATIVE, (value & Flag.NEGATIVE) !== 0);
  }

  reset() {
    this.value = Flag.INTERRUPT_DISABLE | Flag.UNUSED;
  }
}
