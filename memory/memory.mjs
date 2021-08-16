import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bytes = fs.readFileSync(`${__dirname}/memory.wasm`);

async function main() {
  // Create a global
  const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

  // Write uint32s into memory from idx 0
  var i32 = new Uint32Array(memory.buffer);
  for (var i = 0; i < 10; i++) {
    i32[i] = i;
  }

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

  // Create Import Object that Matches Specification
  let importObject = {
    js: {
      mem: memory,
    },
  };

  // Instantiate with Import Object
  let wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);

  // List Actual Exports
  for (let _export in wasmInstance.exports) {
    console.log(
      `Export Actual -- name: ${_export}, type ${typeof wasmInstance.exports[
        _export
      ]}`
    );
  }

  // Call An Export
  // (base, len)
  let result = wasmInstance.exports.accumulate(0, 10);
  console.log(`Result ${result}`);

  i32[0] = 10;
  result = wasmInstance.exports.accumulate(0, 10);
  console.log(`Result ${result}`);
  
}

main();
