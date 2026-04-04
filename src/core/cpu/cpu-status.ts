import { Flag } from "./flag";

export class CPUStatus {
  private value: number = Flag.INTERRUPT_DISABLE | Flag.UNUSED; // valor inicial padrão do NES

  get raw() {
    return this.value;
  }

  set raw(v: number) {
    this.value = v & 0xff;
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
