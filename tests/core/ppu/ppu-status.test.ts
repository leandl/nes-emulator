import { createCPUAndPPU } from "../../../src/core/ppu/factories/create-ppu";
import { PPUStatusFlag } from "../../../src/core/ppu/flag";
import { PPURegisterCode } from "../../../src/core/ppu/ppu-registers";

describe("PPUSTATUS register integration tests", () => {
  it("Reading PPUSTATUS returns VBlank flag when set", () => {
    const [cpu, ppu] = createCPUAndPPU();

    ppu.status.setVBlank();

    const value = cpu.read(PPURegisterCode.PPUSTATUS);

    expect((value & PPUStatusFlag.VBLANK) !== 0).toBe(true);
  });

  it("Reading PPUSTATUS clears VBlank flag", () => {
    const [cpu, ppu] = createCPUAndPPU();

    ppu.status.setVBlank();

    cpu.read(PPURegisterCode.PPUSTATUS);

    expect(ppu.status.is(PPUStatusFlag.VBLANK)).toBe(false);
  });

  it("Reading PPUSTATUS resets address latch", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0x20); // ativa latch

    expect(ppu.addrLatch).toBe(1);

    cpu.read(PPURegisterCode.PPUSTATUS); // deve resetar

    expect(ppu.addrLatch).toBe(0);
  });

  it("PPUSTATUS returns correct high bits (VBlank, Sprite0, Overflow)", () => {
    const [cpu, ppu] = createCPUAndPPU();

    ppu.status.setVBlank();
    ppu.status.setSpriteZeroHit();
    ppu.status.setSpriteOverflow();

    const value = cpu.read(PPURegisterCode.PPUSTATUS);

    const expected =
      PPUStatusFlag.VBLANK |
      PPUStatusFlag.SPRITE_ZERO_HIT |
      PPUStatusFlag.SPRITE_OVERFLOW;

    expect(value & 0xe0).toBe(expected);
  });

  it("Lower 5 bits come from open bus", () => {
    const [cpu, ppu] = createCPUAndPPU();

    ppu.status.updateOpenBus(0x1f);

    const value = cpu.read(PPURegisterCode.PPUSTATUS);

    expect(value & 0x1f).toBe(0x1f);
  });

  it("Reading PPUSTATUS twice: VBlank only present on first read", () => {
    const [cpu, ppu] = createCPUAndPPU();

    ppu.status.setVBlank();

    const first = cpu.read(PPURegisterCode.PPUSTATUS);
    const second = cpu.read(PPURegisterCode.PPUSTATUS);

    expect((first & PPUStatusFlag.VBLANK) !== 0).toBe(true);
    expect((second & PPUStatusFlag.VBLANK) !== 0).toBe(false);
  });
});
