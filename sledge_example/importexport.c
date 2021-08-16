#include <string.h>

#define __IMPORT(name) __attribute__((__import_module__("logger"), __import_name__(#name)))

// "module" "symbol"

void __wasm_log(const char* ptr, int length) __IMPORT(wasm_log);

const char* greeting = "Hello World";

int main(int argc, char** argv) {
    __wasm_log(greeting, strlen(greeting));
}
