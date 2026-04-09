import { CPUStatus } from "./cpu-status";

// SP inicial do NES após reset.
// A stack (0x0100–0x01FF) cresce para baixo e já começa parcialmente usada,
// por isso não inicia em 0xFF.
const INITIAL_STACK_POINTER = 0xfd;

export enum CPURegister {
  ACCUMULATOR = "A",
  X = "X",
  Y = "Y",
  STATUS = "STATUS",
}
export class Registers {
  private _a = 0;
  private _x = 0;
  private _y = 0;

  private _pc = 0;

  private _sp = INITIAL_STACK_POINTER;
  private _status = new CPUStatus();

  // --- 8-bit registers ---

  get A() {
    return this._a;
  }

  set A(value: number) {
    this._a = value & 0xff;
  }

  get X() {
    return this._x;
  }

  set X(value: number) {
    this._x = value & 0xff;
  }

  get Y() {
    return this._y;
  }

  set Y(value: number) {
    this._y = value & 0xff;
  }

  // --- status register ---

  get STATUS() {
    return this._status;
  }

  // --- 16-bit register ---

  get PC() {
    return this._pc;
  }

  set PC(value: number) {
    this._pc = value & 0xffff;
  }

  // --- Stack Pointer (8-bit) ---

  get SP() {
    return this._sp;
  }

  set SP(value: number) {
    this._sp = value & 0xff;
  }

  // --- Helpers úteis ---

  incrementPC() {
    this._pc = (this._pc + 1) & 0xffff;
  }

  incrementSP() {
    this._sp = (this._sp + 1) & 0xff;
  }

  incrementX() {
    this._x = (this._x + 1) & 0xff;
  }

  incrementY() {
    this._y = (this._y + 1) & 0xff;
  }

  decrementPC() {
    this._pc = (this._pc - 1) & 0xffff;
  }

  decrementSP() {
    this._sp = (this._sp - 1) & 0xff;
  }

  decrementX() {
    this._x = (this._x - 1) & 0xff;
  }

  decrementY() {
    this._y = (this._y - 1) & 0xff;
  }

  reset() {
    this._a = 0;
    this._x = 0;
    this._y = 0;
    this._sp = INITIAL_STACK_POINTER;
    this._pc = 0;
  }

  dump() {
    return {
      A: this._a.toString(16).padStart(2, "0"),
      X: this._x.toString(16).padStart(2, "0"),
      Y: this._y.toString(16).padStart(2, "0"),
      PC: this._pc.toString(16).padStart(4, "0"),
      SP: this._sp.toString(16).padStart(2, "0"),
      STATUS: this._status.raw.toString(2).padStart(8, "0"),
    };
  }
}
