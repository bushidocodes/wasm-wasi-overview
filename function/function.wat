(module
    (import "env" "cb" (func $cb (result i32)))
    
    (func (export "run")
        (result i32)
        (call $cb)
    )
)