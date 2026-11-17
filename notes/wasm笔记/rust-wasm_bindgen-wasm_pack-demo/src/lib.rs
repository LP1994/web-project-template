use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};

// ============================================================
// 1. Wasm 启动时执行的初始化函数
// ============================================================
#[wasm_bindgen(start)]
pub fn on_start() {
    console_error_panic_hook::set_once();
}

// ============================================================
// 2. 基础类型：数字计算
// ============================================================
#[wasm_bindgen]
pub fn add(a: f64, b: f64) -> f64 {
    a + b
}

#[wasm_bindgen]
pub fn multiply(a: f64, b: f64) -> f64 {
    a * b
}

// ============================================================
// 3. 字符串：JavaScript String <--> Rust String
// ============================================================
#[wasm_bindgen]
pub fn greet(name: String) -> String {
    format!("你好，{}！欢迎使用 Rust + WebAssembly。", name)
}

// ============================================================
// 4. 错误处理：Rust Result <--> JavaScript Exception
// JavaScript 调用：
// try {
//     const result = divide(10, 2);
//
//     console.log(result);
// } catch (error) {
//     console.error(error);
// }
// 结果：5
//
// 如果调用：
// try {
//     divide(10, 0);
// } catch (error) {
//     console.error(error);
// }
// 则会捕获 Rust 返回的错误。
//
// 需要区分两种错误：
// - Result<T, JsValue>：主动返回的业务错误，可以通过 JavaScript try...catch 处理。
// - Rust panic!：属于 Rust 程序异常，不等同于普通的 Result。console_error_panic_hook 主要负责将 panic 信息输出到浏览器控制台，不代表自动恢复程序执行。
// 实际项目中，参数校验失败、数据格式错误、业务规则不满足等情况，建议优先通过 Result 返回。
// ============================================================
#[wasm_bindgen]
pub fn divide(a: f64, b: f64) -> Result<f64, JsValue> {
    if b == 0.0 {
        return Err( JsValue::from_str("除数不能为 0！") );
    }

    Ok(a / b)
}

// ============================================================
// 5. 数组：JavaScript Float64Array <--> Rust Box<[f64]>
// JavaScript 一侧可以直接使用：
// const values = new Float64Array([1, 2, 3]);
// const result = scale_values(values, 10);
// 结果是：
// Float64Array(3) [10, 20, 30]
// ============================================================
#[wasm_bindgen]
pub fn scale_values(
    mut values: Box<[f64]>,
    factor: f64,
) -> Box<[f64]> {
    for value in values.iter_mut() {
        *value *= factor;
    }

    values
}

// ============================================================
// 6. Rust 结构体：导出为 JavaScript Class
// ============================================================
#[wasm_bindgen]
pub struct Counter {
    value: i32,
}

#[wasm_bindgen]
impl Counter {
    // JavaScript: new Counter(10)
    #[wasm_bindgen(constructor)]
    pub fn new(initial_value: i32) -> Counter {
        Counter {
            value: initial_value,
        }
    }

    // JavaScript: counter.increment()
    pub fn increment(&mut self) {
        self.value += 1;
    }

    // JavaScript: counter.decrement()
    pub fn decrement(&mut self) {
        self.value -= 1;
    }

    // JavaScript: counter.get_value()
    pub fn get_value(&self) -> i32 {
        self.value
    }
}

// ============================================================
// 7. JavaScript Object <--> Rust Struct
// ============================================================
#[derive(Serialize, Deserialize)]
pub struct UserData {
    name: String,

    score: f64,

    tags: Vec<String>,
}

#[wasm_bindgen]
pub fn normalize_user(
    value: JsValue,
) -> Result<JsValue, JsValue> {
    // JavaScript Object -> Rust Struct
    let mut user: UserData =
        serde_wasm_bindgen::from_value(value)
            .map_err(|error| {
                JsValue::from_str(&error.to_string())
            })?;

    // Rust 业务逻辑
    user.name = user.name.trim().to_string();

    user.score = user.score.clamp(0.0, 100.0);

    // Rust Struct -> JavaScript Object
    serde_wasm_bindgen::to_value(&user)
        .map_err(|error| {
            JsValue::from_str(&error.to_string())
        })
}

// ============================================================
// 8. 异步函数与 Promise
// JavaScript调用：
// const result = await calculate_async(10, 20);
// console.log(result);
// ============================================================
#[wasm_bindgen]
pub async fn calculate_async(
    a: f64,
    b: f64,
) -> Result<f64, JsValue> {

    Ok(a + b)
}

// ============================================================
// 9. Rust 调用浏览器 API
// ============================================================
#[wasm_bindgen]
pub fn btoa(input: &str) -> Result<String, JsValue> {
    let window = web_sys::window()
            .ok_or_else(|| {
                JsValue::from_str("无法获取 Window")
            })?;

    // UTF-8 字节转换为单字节字符组成的二进制字符串。
    let binary = input
            .as_bytes()
            .iter()
            .map(|&byte| char::from(byte))
            .collect::<String>();

        window.btoa(&binary)
}
