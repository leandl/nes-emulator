import { PPURegisterCode } from "../ppu-registers";
import { PPUAddrRegister } from "../registers/ppu-addr-register";
import { PPUStatusRegister } from "../registers/ppu-status-register";
import { Register } from "../registers/register";

export const allRegisters: Record<PPURegisterCode, Register> = {
  [PPURegisterCode.PPUSTATUS]: new PPUStatusRegister(),
  [PPURegisterCode.PPUADDR]: new PPUAddrRegister(),
};
