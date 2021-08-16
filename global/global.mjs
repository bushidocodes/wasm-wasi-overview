import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bytes = fs.readFileSync(`${__dirname}/global.wasm`);

async function main() {
  // Create a global
  const global = new WebAssembly.Global({ value: "i32", mutable: true }, 42);

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
      global: global,
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
  wasmInstance.exports.incGlobal();
  wasmInstance.exports.incGlobal();
  wasmInstance.exports.incGlobal();
  console.log(`${global.value}`);

  // Destroy Instance?

  // Call global
}

main();
