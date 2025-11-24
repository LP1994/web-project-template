// #[unsafe(no_mangle)] → 保证函数名不会被 Rust 编译器修改。Rust 2024语法这么要求写的！
// extern "C" → 使用 C ABI，方便其他语言或运行时调用。
#[unsafe(no_mangle)]
pub extern "C" fn Add(a: i32, b: i32) -> i32 {
    a + b
}
