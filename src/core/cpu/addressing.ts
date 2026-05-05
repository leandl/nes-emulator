import type { CPU } from ".";

export type AddressResult = {
  address: number;
  pageCrossed: boolean;
};

export type AddressResolver = (cpu: CPU) => AddressResult;

const noCross = (address: number): AddressResult => ({
  address,
  pageCrossed: false,
});

const hasCrossed = (base: number, addr: number): boolean =>
  (base & 0xff00) !== (addr & 0xff00);

export const Addressing = {
  // LDA #$10
  immediate: (cpu: CPU) => noCross(cpu.registers.PC++),

  // LDA $10
  zeroPage: (cpu: CPU) => {
    const address = cpu.memory.read(cpu.registers.PC++);
    return noCross(address);
  },

  // LDA $10,X
  zeroPageX: (cpu: CPU) => {
    const base = cpu.memory.read(cpu.registers.PC++);
    const address = (base + cpu.registers.X) & 0xff;
    return noCross(address);
  },

  // LDA $10,Y
  zeroPageY: (cpu: CPU) => {
    const base = cpu.memory.read(cpu.registers.PC++);
    const address = (base + cpu.registers.Y) & 0xff;
    return noCross(address);
  },

  // LDA $1234
  absolute: (cpu: CPU) => {
    const lo = cpu.memory.read(cpu.registers.PC++);
    const hi = cpu.memory.read(cpu.registers.PC++);
    const address = (hi << 8) | lo;
    return noCross(address);
  },

  // LDA $1234,X
  absoluteX: (cpu: CPU) => {
    const lo = cpu.memory.read(cpu.registers.PC++);
    const hi = cpu.memory.read(cpu.registers.PC++);
    const base = (hi << 8) | lo;

    const address = base + cpu.registers.X;
    const pageCrossed = hasCrossed(base, address);

    return { address, pageCrossed };
  },

  // LDA $1234,Y
  absoluteY: (cpu: CPU) => {
    const lo = cpu.memory.read(cpu.registers.PC++);
    const hi = cpu.memory.read(cpu.registers.PC++);
    const base = (hi << 8) | lo;

    const address = base + cpu.registers.Y;
    const pageCrossed = hasCrossed(base, address);

    return { address, pageCrossed };
  },

  // LDA ($20,X)
  indirectX: (cpu: CPU) => {
    const base = (cpu.memory.read(cpu.registers.PC++) + cpu.registers.X) & 0xff;

    const lo = cpu.memory.read(base);
    const hi = cpu.memory.read((base + 1) & 0xff);

    const address = (hi << 8) | lo;
    return noCross(address);
  },

  // LDA ($20),Y
  indirectY: (cpu: CPU) => {
    const zp = cpu.memory.read(cpu.registers.PC++);

    const lo = cpu.memory.read(zp);
    const hi = cpu.memory.read((zp + 1) & 0xff);

    const base = (hi << 8) | lo;
    const address = base + cpu.registers.Y;

    const pageCrossed = hasCrossed(base, address);

    return { address, pageCrossed };
  },

  // JMP ($1234)
  indirect: (cpu: CPU) => {
    const loPtr = cpu.memory.read(cpu.registers.PC++);
    const hiPtr = cpu.memory.read(cpu.registers.PC++);
    const ptr = (hiPtr << 8) | loPtr;

    const lo = cpu.memory.read(ptr);

    // BUG do 6502 (ESSENCIAL)
    const hi = cpu.memory.read((ptr & 0xff00) | ((ptr + 1) & 0x00ff));

    const address = (hi << 8) | lo;
    return noCross(address);
  },

  // Branch (relative)
  relative: (cpu: CPU) => {
    const offset = cpu.memory.read(cpu.registers.PC++);

    // converte para signed [-128, 127]
    const signed = offset < 0x80 ? offset : offset - 0x100;

    return {
      address: signed,
      pageCrossed: false, // será calculado na instruction
    };
  },
};
