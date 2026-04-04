export enum Flag {
  CARRY = 1 << 0,
  ZERO = 1 << 1,
  INTERRUPT_DISABLE = 1 << 2,
  DECIMAL = 1 << 3,
  BREAK = 1 << 4,
  UNUSED = 1 << 5,
  OVERFLOW = 1 << 6,
  NEGATIVE = 1 << 7,
}
