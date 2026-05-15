import { allInstructions } from "./core/cpu/factories/instructions/all-instructions";
import { Registers } from "./core/cpu/registers";

const registers = new Registers();

console.log(registers, Object.keys(allInstructions));
