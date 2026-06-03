import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmBytes = readFileSync(join(__dirname, "function.wasm"));

const callbacks = [
  () => 4,
  () => 8,
  () => 15,
  () => 16,
  () => 23,
  () => 42,
];

async function main() {
  const wasmModule = await WebAssembly.compile(wasmBytes);

  for (const spec of WebAssembly.Module.imports(wasmModule)) {
    console.log(`Import Spec -- ${JSON.stringify(spec)}`);
  }
  for (const spec of WebAssembly.Module.exports(wasmModule)) {
    console.log(`Export Spec -- ${JSON.stringify(spec)}`);
  }

  // Each instance gets its own `cb` import, so `run()` returns whatever
  // that instance's callback returns. Demonstrates that one compiled
  // module can be instantiated many times with different imports.
  for (const [i, cb] of callbacks.entries()) {
    const instance = await WebAssembly.instantiate(wasmModule, { env: { cb } });
    console.log(`instance${i + 1} : ${instance.exports.run()}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
