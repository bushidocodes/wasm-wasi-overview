# wasm-wasi-overview

A small set of runnable Node.js examples that walk through the four kinds of
things a WebAssembly module can import or export — **function**, **global**,
**memory**, **table**.

The examples are deliberately minimal. Each pairs a hand-written `.wat`
module with a `.mjs` host program that compiles it, inspects its
import/export specs, instantiates it, and calls it.

## Requirements

- Node.js >= 18 (uses the built-in `WebAssembly` global and ESM)
- No npm dependencies

## Running the examples

```sh
npm run example:function   # function import/export
npm run example:global     # imported mutable global
npm run example:memory     # imported linear memory shared with JS
npm run example:table      # imported table populated by an elem section
npm run examples           # all four in sequence
```

Or run any one directly:

```sh
node function/function.mjs
```

## What each example shows

### [`function/`](function/)

One compiled module, six instances, each given a different `cb` import.
Demonstrates that the imported function is bound per-instance, not per-module,
so the same `(call $cb)` returns different values depending on what the host
passed in.

- [`function.wat`](function/function.wat) — imports `env.cb` and exports `run`
- [`function.mjs`](function/function.mjs)

### [`global/`](global/)

A `WebAssembly.Global` created on the JS side is imported by the module.
The module exports `incGlobal` / `getGlobal`; mutations from wasm are visible
to JS through the same `Global` object.

- [`global.wat`](global/global.wat) — imports `js.global` as `(mut i32)`
- [`global.mjs`](global/global.mjs)

### [`memory/`](memory/)

A `WebAssembly.Memory` is created on the JS side, seeded with `0..9` as
`Uint32`s, and passed in as an import. The module exports `accumulate(ptr, len)`,
which sums `len` consecutive i32s starting at `ptr`. Mutating the typed-array
view on the JS side is visible on the next call.

- [`memory.wat`](memory/memory.wat) — imports `js.mem`
- [`memory.mjs`](memory/memory.mjs)

### [`table/`](table/)

A `WebAssembly.Table` of `anyfunc` is created on the JS side and imported by
the module. The module's `elem` section installs two funcrefs into slots 0
and 1, which are then called from JS via `table.get(i)()`.

- [`table.wat`](table/table.wat) — imports `js.tbl`
- [`table.mjs`](table/table.mjs)

## Reference notes

[`notes.md`](notes.md) collects the conceptual material the examples back up:
the key WebAssembly components, how the host interacts with each
import/export kind, custom sections, error categories, and useful links to
the spec and Wasmtime docs.

## Repository layout

```
.
├── function/          # function import example
├── global/            # global import example
├── memory/            # memory import example
├── table/             # table import example
├── notes.md           # reference notes on the WebAssembly model
└── package.json       # run scripts, no dependencies
```

## Regenerating the .wasm files

The `.wasm` files are committed so the examples run with no toolchain. To
rebuild them from the `.wat` sources, install
[wabt](https://github.com/WebAssembly/wabt) and run:

```sh
wat2wasm function/function.wat -o function/function.wasm
wat2wasm global/global.wat   -o global/global.wasm
wat2wasm memory/memory.wat   -o memory/memory.wasm
wat2wasm table/table.wat     -o table/table.wasm
```

## License

MIT
