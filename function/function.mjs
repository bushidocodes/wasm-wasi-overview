import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bytes = fs.readFileSync(`${__dirname}/function.wasm`);

async function main() {
  let cb1 = () => 4;
  let cb2 = () => 8;
  let cb3 = () => 15;
  let cb4 = () => 16;
  let cb5 = () => 23;
  let cb6 = () => 42;

  // Loads wasm code
  let wasmCode = new Uint8Array(bytes);

  // Compiles wasm module
  let wasmModule = await WebAssembly.compile(wasmCode);

  // List Imports Specification
  for (let _import of WebAssembly.Module.imports(wasmModule)) {
    console.log(`Import Spec -- ${JSON.stringify(_import)}`);
  }

  // List Exports Specification
  for (let _export of WebAssembly.Module.exports(wasmModule)) {
    console.log(`Export Spec -- ${JSON.stringify(_export)}`);
  }

  // Instance 1
  let instance1 = await WebAssembly.instantiate(wasmModule, {
    env: { cb: cb1 },
  });
  let instance2 = await WebAssembly.instantiate(wasmModule, {
    env: { cb: cb2 },
  });
  let instance3 = await WebAssembly.instantiate(wasmModule, {
    env: { cb: cb3 },
  });
  let instance4 = await WebAssembly.instantiate(wasmModule, {
    env: { cb: cb4 },
  });
  let instance5 = await WebAssembly.instantiate(wasmModule, {
    env: { cb: cb5 },
  });
  let instance6 = await WebAssembly.instantiate(wasmModule, {
    env: { cb: cb6 },
  });

  console.log(`instance1 : ${instance1.exports.run()}`);
  console.log(`instance2 : ${instance2.exports.run()}`);
  console.log(`instance3 : ${instance3.exports.run()}`);
  console.log(`instance4 : ${instance4.exports.run()}`);
  console.log(`instance5 : ${instance5.exports.run()}`);
  console.log(`instance6 : ${instance6.exports.run()}`);
}

main();
