import { Cartridge } from "../cartridge";
import { PPURegisterCode } from "./ppu-registers";
import { PPUStatus } from "./ppu-status";
import { Register } from "./registers/register";

export class PPU {
  status = new PPUStatus();
  addrLatch = 0;
  vramAddr = 0;
  tempAddr = 0;

  constructor(
    _cartridge: Cartridge,
    private registers: Record<PPURegisterCode, Register>,
  ) {}

  mirrorPPURegister(addr: number): PPURegisterCode {
    return (0x2000 + (addr & 7)) as PPURegisterCode;
  }

  // ========================
  // CPU -> PPU
  // ========================
  cpuRead(addr: number): number {
    const registerCode = this.mirrorPPURegister(addr);

    const register = this.registers[registerCode];
    if (register) {
      return register.read(this);
    }

    return 0;
  }

  cpuWrite(addr: number, data: number): void {
    const registerCode = this.mirrorPPURegister(addr);

    const register = this.registers[registerCode];
    if (register) {
      register.write(this, data);
    }
  }

  // ========================
  // DMA (obrigatório existir)
  // ========================
  writeOAM(_data: number): void {
    // não precisa fazer nada
  }
}
