import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmBytes = readFileSync(join(__dirname, "table.wasm"));

async function main() {
  const table = new WebAssembly.Table({
    element: "anyfunc",
    initial: 1,
    maximum: 10,
  });
  table.grow(1);

  const wasmModule = await WebAssembly.compile(wasmBytes);

  for (const spec of WebAssembly.Module.imports(wasmModule)) {
    console.log(`Import Spec -- ${JSON.stringify(spec)}`);
  }
  for (const spec of WebAssembly.Module.exports(wasmModule)) {
    console.log(`Export Spec -- ${JSON.stringify(spec)}`);
  }

  const importObject = { js: { tbl: table } };
  const instance = await WebAssembly.instantiate(wasmModule, importObject);

  for (const name of Object.keys(instance.exports)) {
    console.log(`Export Actual -- name: ${name}, type ${typeof instance.exports[name]}`);
  }

  // The wasm module's `elem` section populated slots 0 and 1 with
  // funcrefs. From JS we can call them through `table.get(i)()`.
  console.log(`Table Length ${table.length}`);
  console.log(`Table Elem 0 type ${typeof table.get(0)}`);
  console.log(`Table Elem 0 res ${table.get(0)()}`);
  console.log(`Table Elem 1 type ${typeof table.get(1)}`);
  console.log(`Table Elem 1 res ${table.get(1)()}`);
}

main();
