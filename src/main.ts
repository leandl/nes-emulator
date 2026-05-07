import { allInstruction } from "./core/cpu/factories/instructions/all-instructions";
import { Registers } from "./core/cpu/registers";

const registers = new Registers();

console.log(Object.keys(allInstruction));
