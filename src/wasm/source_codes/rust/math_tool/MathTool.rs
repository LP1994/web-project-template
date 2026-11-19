// #![...] 是 Crate 级别的内部属性（Inner Attribute），作用范围是整个 Crate。
// allow(non_snake_case) 表示允许不符合 snake_case 命名规范的标识符，不再针对这条规则产生警告。
// #![allow(non_snake_case)]

// std、core 和 alloc 的区别
// 组件      作用                                       是否适合当前项目
// core     Rust 核心语言功能、基础类型、基础运算等          需要
// alloc    动态内存分配及 Vec、Box、String 等类型         暂时不需要
// std      标准库，包含文件、网络、线程、标准输入输出等功能   暂时不需要
// wasm32-unknown-unknown 支持 core、alloc 和 std，并不要求你的项目必须使用 std。
// 不链接 Rust 标准库 std，仅使用 core。以便缩小最终的输出wasm文件。
#![no_std]

// 自定义 panic 处理函数。
// 使用 #![no_std] 并将 Crate 编译为 cdylib 时，Rust 不再提供标准库默认的 panic 处理器，因此需要自己定义一个。
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo<'_>) -> ! {
  // 发生 panic 时触发 WebAssembly unreachable 指令。
  // 它会生成 WebAssembly 的 unreachable 指令，执行时触发 Wasm Trap，从而立即终止当前执行。
  // 这个 API 从 Rust 1.37.0 开始稳定支持。
  core::arch::wasm32::unreachable()
}

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
