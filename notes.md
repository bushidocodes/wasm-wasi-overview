# Key WebAssembly Components

1. Hosting Environment
2. WebAssembly module
3. WebAssembly store
4. Export/Import Types:

- Function
- Global
- Memory
- Table

5. WebAssembly instance

6. Custom Sections

- Does not affect execution. Stores metadata, compiler hints, etc.

- Name Section - Maps table indices to printable names
- Debugging???
- Producer Section - Includes info on source language(s), compilers and tools used, and SDKs
- dylink section (https://github.com/WebAssembly/tool-conventions/blob/main/DynamicLinking.md)
- One of the AOT compilers adds native code in a custom section within a \*.wasm file.

7. WebAssembly Errors

- Compile Error
- Link Error
- Runtime Error

# How the Hosting Environment interacts with WebAssembly Export/Import Types

- Global
  - Create a mutable or immutable Global
  - Get/Set the value of an existing mutable Global
- Memory
  - Create a Memory defined with a current number of pages, a max number of pages, and a flag indicating if the memory is allowed to be shared (imported by multiple WebAssembly instances)
  - Grow a Memory
  - Read and write data in the memory
- Table
  - Create a Table with a particular size
  - Get/Set an element in a Table
  - Get the length of the Table
  - Grow the size of a Table
- Function
  - No special API here. Functions are transparently made callable when they are set as references in the import object.

# How the Hosting Environment interacts with \*.wasm WebAssembly modules

- loads WebAssembly binary into memory from the disk or network
- validates a WebAssembly binary
- List imports
- List exports
- List custom sections
- compiles a WebAssembly binary into native executable code (might be streamed)
  - This involve passing an import object (two-level hashmap with the expected imports)
- (Experimental) Link two modules together - Associate all exports of Module A as a namespace used by imports of Module B.

# How the Hosting Environment interacts with WebAssembly instances

- List exports
- Call exported Functions
- Use exported linear memories, globals, etc

# How the Hosting Environment interacts with WebAssembly Errors

- Catch trap

# Additional Resources:

- Wasmtime C example is instructive: https://docs.wasmtime.dev/examples-c-hello-world.html
- Proposed WebAssembly extensions: https://webassembly.org/roadmap/
- Interface Types: https://github.com/WebAssembly/module-linking/blob/master/proposals/module-linking/Explainer.md
