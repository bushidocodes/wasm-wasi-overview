import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmBytes = readFileSync(join(__dirname, "memory.wasm"));

async function main() {
  const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

  // Seed the first ten i32 slots with 0..9. The wasm module reads them
  // back through its imported memory.
  const i32 = new Uint32Array(memory.buffer);
  for (let i = 0; i < 10; i++) {
    i32[i] = i;
  }

  const wasmModule = await WebAssembly.compile(wasmBytes);

  for (const spec of WebAssembly.Module.imports(wasmModule)) {
    console.log(`Import Spec -- ${JSON.stringify(spec)}`);
  }
  for (const spec of WebAssembly.Module.exports(wasmModule)) {
    console.log(`Export Spec -- ${JSON.stringify(spec)}`);
  }

  const importObject = { js: { mem: memory } };
  const instance = await WebAssembly.instantiate(wasmModule, importObject);

  for (const name of Object.keys(instance.exports)) {
    console.log(`Export Actual -- name: ${name}, type ${typeof instance.exports[name]}`);
  }

  // accumulate(ptr, len) sums `len` consecutive i32s starting at `ptr`.
  console.log(`Result ${instance.exports.accumulate(0, 10)}`);

  // Mutating the JS-side view is visible to wasm on the next call.
  i32[0] = 10;
  console.log(`Result ${instance.exports.accumulate(0, 10)}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
