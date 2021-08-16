import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bytes = fs.readFileSync(`${__dirname}/table.wasm`);

async function main() {
  // Create a table
  var table = new WebAssembly.Table({
    element: "anyfunc",
    initial: 1,
    maximum: 10,
  });
  table.grow(1);

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
      tbl: table,
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

  console.log(`Table Length ${table.length}`);
  console.log(`Table Elem 0 type ${typeof table.get(0)}`);
  console.log(`Table Elem 0 res ${table.get(0)()}`);
  console.log(`Table Elem 1 type ${typeof table.get(1)}`);
  console.log(`Table Elem 1 res ${table.get(1)()}`);

  // Destroy Instance?
}

main();
