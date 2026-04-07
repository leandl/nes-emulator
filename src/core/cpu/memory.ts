export class Memory {
  private memory = new Uint8Array(0x10000); // 64KB

  read(addr: number): number {
    return this.memory[addr & 0xffff];
  }

  write(addr: number, value: number) {
    this.memory[addr & 0xffff] = value & 0xff;
  }

  load(program: number[], startAddress: number = 0x8000) {
    this.memory.set(program, startAddress);
  }

  reset() {
    this.memory.fill(0);
  }
}
