import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmBytes = readFileSync(join(__dirname, "global.wasm"));

async function main() {
  const global = new WebAssembly.Global({ value: "i32", mutable: true }, 42);

  const wasmModule = await WebAssembly.compile(wasmBytes);

  for (const spec of WebAssembly.Module.imports(wasmModule)) {
    console.log(`Import Spec -- ${JSON.stringify(spec)}`);
  }
  for (const spec of WebAssembly.Module.exports(wasmModule)) {
    console.log(`Export Spec -- ${JSON.stringify(spec)}`);
  }

  const importObject = { js: { global } };
  const instance = await WebAssembly.instantiate(wasmModule, importObject);

  for (const name of Object.keys(instance.exports)) {
    console.log(`Export Actual -- name: ${name}, type ${typeof instance.exports[name]}`);
  }

  instance.exports.incGlobal();
  instance.exports.incGlobal();
  instance.exports.incGlobal();
  console.log(`${global.value}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
