// #[unsafe(no_mangle)] → 保证函数名不会被 Rust 编译器修改。Rust 2024语法这么要求写的！
// extern "C" → 使用 C ABI，方便其他语言或运行时调用。
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
    if b == 0.0 {
        f64::NAN
    } else {
        a / b
    }
}

#[unsafe(no_mangle)]
pub extern "C" fn Mod(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        f64::NAN
    } else {
        a % b
    }
}

#[unsafe(no_mangle)]
pub extern "C" fn Fib(index: usize, initial1: f64, initial2: f64) -> f64 {
    if index <= 1 {
        return initial1;
    } else if index == 2 {
        return initial2;
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
