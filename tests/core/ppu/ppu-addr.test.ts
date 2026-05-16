import { createCPUAndPPU } from "../../../src/core/ppu/factories/create-ppu";
import { PPURegisterCode } from "../../../src/core/ppu/ppu-registers";

describe("PPUADDR register integration tests", () => {
  it("First write sets high byte and updates latch", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0x3f);

    expect(ppu.tempAddr).toBe(0x3f00);
    expect(ppu.addrLatch).toBe(1);
  });

  it("Second write sets low byte and updates vramAddr", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0x3f); // high
    cpu.write(PPURegisterCode.PPUADDR, 0x20); // low

    expect(ppu.vramAddr).toBe(0x3f20);
    expect(ppu.addrLatch).toBe(0);
  });

  it("High byte is masked to 6 bits", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0xff); // should mask to 0x3f

    expect(ppu.tempAddr).toBe(0x3f00);
  });

  it("Multiple writes alternate between high and low", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0x21); // high
    expect(ppu.addrLatch).toBe(1);

    cpu.write(PPURegisterCode.PPUADDR, 0x00); // low
    expect(ppu.addrLatch).toBe(0);
    expect(ppu.vramAddr).toBe(0x2100);

    cpu.write(PPURegisterCode.PPUADDR, 0x22); // high again
    expect(ppu.addrLatch).toBe(1);
  });

  it("Reading PPUSTATUS resets latch during address write sequence", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0x3f); // first write
    expect(ppu.addrLatch).toBe(1);

    cpu.read(PPURegisterCode.PPUSTATUS); // reset latch

    expect(ppu.addrLatch).toBe(0);

    // next write should be treated as high byte again
    cpu.write(PPURegisterCode.PPUADDR, 0x20);

    expect(ppu.tempAddr).toBe(0x2000);
    expect(ppu.addrLatch).toBe(1);
  });

  it("Final VRAM address is always 14-bit (mirrored)", () => {
    const [cpu, ppu] = createCPUAndPPU();

    cpu.write(PPURegisterCode.PPUADDR, 0xff); // high -> 0x3f
    cpu.write(PPURegisterCode.PPUADDR, 0xff); // low

    expect(ppu.vramAddr & 0x3fff).toBe(ppu.vramAddr);
  });
});
