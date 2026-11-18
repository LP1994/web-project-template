// #[unsafe(no_mangle)] → 禁止 Rust 对导出符号名称进行名称改编。不执行 Rust 符号名称修饰，保留导出名称。Rust 2024语法这么要求写的！
// #[unsafe(no_mangle)] 是 Rust 1.82 才引入的语法！可以同时适用于 Rust 2021 和 Rust 2024 Edition（前提是 Rust 编译器版本不低于 1.82）。
// pub：将函数声明为公开函数。允许函数被外部访问。
// extern "C" → 指定 C ABI，采用 C ABI 调用约定。定义跨语言调用使用的函数调用约定。
#[unsafe(no_mangle)]
pub extern "C" fn Add(a: f64, b: f64) -> f64 {
    a + b
}

#[unsafe(no_mangle)]
pub extern "C" fn Sub(a: f64, b: f64) -> f64 {
    a - b
}

#[unsafe(no_mangle)]
pub extern "C" fn Mul(a: f64, b: f64) -> f64 {
    a * b
}

#[unsafe(no_mangle)]
pub extern "C" fn Div(a: f64, b: f64) -> f64 {
    if b == 0.0 { f64::NAN } else { a / b }
}

#[unsafe(no_mangle)]
pub extern "C" fn Mod(a: f64, b: f64) -> f64 {
    if b == 0.0 { f64::NAN } else { a % b }
}

#[unsafe(no_mangle)]
pub extern "C" fn Fib(index: usize, initial1: f64, initial2: f64) -> f64 {
    if index <= 1 {
        return initial1;
    } else if index == 2 {
        return initial2;
    } else if index > 1476 {
        return f64::NAN;
    }

    let mut prev = initial1;
    let mut curr = initial2;

    for _ in 3..=index {
        let next = prev + curr;
        prev = curr;
        curr = next;
    }

    curr
}
