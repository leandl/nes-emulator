import type { CPU } from ".";

export type AddressResolver = (cpu: CPU) => number;

export const Addressing = {
  // LDA #$10
  immediate: (cpu: CPU) => {
    return cpu.registers.PC++;
  },

  // LDA $10
  zeroPage: (cpu: CPU) => {
    return cpu.memory.read(cpu.registers.PC++);
  },

  // LDA $10,X
  zeroPageX: (cpu: CPU) => {
    const base = cpu.memory.read(cpu.registers.PC++);
    const addr = (base + cpu.registers.X) & 0xff; // wrap-around zero page
    return addr;
  },

  // LDA $10,Y
  zeroPageY: (cpu: CPU) => {
    const base = cpu.memory.read(cpu.registers.PC++);
    const addr = (base + cpu.registers.Y) & 0xff; // wrap-around zero page
    return addr;
  },

  // LDA $1234
  absolute: (cpu: CPU) => {
    const lo = cpu.memory.read(cpu.registers.PC++);
    const hi = cpu.memory.read(cpu.registers.PC++);
    const addr = (hi << 8) | lo;
    return addr;
  },

  // LDA $1234,X
  absoluteX: (cpu: CPU) => {
    const lo = cpu.memory.read(cpu.registers.PC++);
    const hi = cpu.memory.read(cpu.registers.PC++);
    const addr = ((hi << 8) | lo) + cpu.registers.X;
    return addr;
  },

  // LDA $1234,Y
  absoluteY: (cpu: CPU) => {
    const lo = cpu.memory.read(cpu.registers.PC++);
    const hi = cpu.memory.read(cpu.registers.PC++);
    const addr = ((hi << 8) | lo) + cpu.registers.Y;
    return addr;
  },

  // LDA ($20,X)
  indirectX: (cpu: CPU) => {
    const base = (cpu.memory.read(cpu.registers.PC++) + cpu.registers.X) & 0xff;
    const lo = cpu.memory.read(base);
    const hi = cpu.memory.read((base + 1) & 0xff); // wrap-around zero page
    const addr = (hi << 8) | lo;
    return addr;
  },

  // LDA ($20),Y
  indirectY: (cpu: CPU) => {
    const base = cpu.memory.read(cpu.registers.PC++);
    const lo = cpu.memory.read(base);
    const hi = cpu.memory.read((base + 1) & 0xff); // wrap-around zero page
    const addr = ((hi << 8) | lo) + cpu.registers.Y;
    return addr;
  },

  // JMP ($1234)
  indirect: (cpu: CPU) => {
    const loPtr = cpu.memory.read(cpu.registers.PC++);
    const hiPtr = cpu.memory.read(cpu.registers.PC++);
    const ptr = (hiPtr << 8) | loPtr;

    const lo = cpu.memory.read(ptr);

    // BUG do 6502 (ESSENCIAL)
    const hi = cpu.memory.read((ptr & 0xff00) | ((ptr + 1) & 0x00ff));

    return (hi << 8) | lo;
  },

  // BEQ +5
  relative: (cpu: CPU) => {
    const offset = cpu.memory.read(cpu.registers.PC++);

    // converte para signed (-128 a +127)
    return offset < 0x80 ? offset : offset - 0x100;
  },
};
