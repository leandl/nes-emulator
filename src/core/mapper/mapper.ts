export interface Mapper {
  cpuRead(addr: number): number;
  cpuWrite(addr: number, data: number): void;

  ppuRead(addr: number): number;
  ppuWrite(addr: number, data: number): void;
}
