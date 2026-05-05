import { CPUStatus } from "./cpu-status";

// SP inicial do NES após reset.
// A stack (0x0100–0x01FF) cresce para baixo e já começa parcialmente usada,
// por isso não inicia em 0xFF.
const INITIAL_STACK_POINTER = 0xfd;

export enum CPURegister {
  ACCUMULATOR = "A",
  X = "X",
  Y = "Y",
  PROGRAM_COUNTER = "PC",
  STACK_POINTER = "SP",
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

  get [CPURegister.ACCUMULATOR]() {
    return this._a;
  }

  set [CPURegister.ACCUMULATOR](value: number) {
    this._a = value & 0xff;
  }

  get [CPURegister.X]() {
    return this._x;
  }

  set [CPURegister.X](value: number) {
    this._x = value & 0xff;
  }

  get [CPURegister.Y]() {
    return this._y;
  }

  set [CPURegister.Y](value: number) {
    this._y = value & 0xff;
  }

  // --- status register ---

  get [CPURegister.STATUS]() {
    return this._status;
  }

  // --- 16-bit register ---

  get [CPURegister.PROGRAM_COUNTER]() {
    return this._pc;
  }

  set [CPURegister.PROGRAM_COUNTER](value: number) {
    this._pc = value & 0xffff;
  }

  // --- Stack Pointer (8-bit) ---

  get [CPURegister.STACK_POINTER]() {
    return this._sp;
  }

  set [CPURegister.STACK_POINTER](value: number) {
    this._sp = value & 0xff;
  }

  // --- Helpers úteis ---

  incrementSP() {
    this._sp = (this._sp + 1) & 0xff;
  }

  incrementX() {
    this._x = (this._x + 1) & 0xff;
  }

  incrementY() {
    this._y = (this._y + 1) & 0xff;
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
    this._status.reset();
  }

  dump() {
    return {
      [CPURegister.ACCUMULATOR]: this._a.toString(16).padStart(2, "0"),
      [CPURegister.X]: this._x.toString(16).padStart(2, "0"),
      [CPURegister.Y]: this._y.toString(16).padStart(2, "0"),
      [CPURegister.PROGRAM_COUNTER]: this._pc.toString(16).padStart(4, "0"),
      [CPURegister.STACK_POINTER]: this._sp.toString(16).padStart(2, "0"),
      [CPURegister.STATUS]: this._status.raw.toString(2).padStart(8, "0"),
    };
  }
}
