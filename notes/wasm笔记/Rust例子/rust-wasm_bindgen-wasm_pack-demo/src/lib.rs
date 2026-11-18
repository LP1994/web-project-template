// #![...] 是 Crate 级别的内部属性（Inner Attribute），作用范围是整个 Crate。
// allow(non_snake_case) 表示允许不符合 snake_case 命名规范的标识符，不再针对这条规则产生警告。
// #![allow(non_snake_case)]

use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};

use gloo_timers::future::TimeoutFuture;

use js_sys::JSON;

use web_sys::Window;

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
pub fn greet(name: &str) -> String {
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
    if !a.is_finite() || !b.is_finite() {
        return Err(JsValue::from_str("输入参数必须是有限数值"));
    }

    if b == 0.0 {
        return Err(JsValue::from_str("除数不能为 0！"));
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
pub fn scale_values(mut values: Box<[f64]>, factor: f64) -> Box<[f64]> {
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
    #[wasm_bindgen(constructor)]
    pub fn new(initial_value: i32) -> Counter {
        Counter {
            value: initial_value,
        }
    }

    pub fn increment(&mut self) -> Result<(), JsValue> {
        self.value = self
            .value
            .checked_add(1)
            .ok_or_else(|| JsValue::from_str("Counter 已达到 i32 最大值"))?;

        Ok(())
    }

    pub fn decrement(&mut self) -> Result<(), JsValue> {
        self.value = self
            .value
            .checked_sub(1)
            .ok_or_else(|| JsValue::from_str("Counter 已达到 i32 最小值"))?;

        Ok(())
    }

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
pub fn normalize_user(value: JsValue) -> Result<JsValue, JsValue> {
    let mut user: UserData = serde_wasm_bindgen::from_value(value)
        .map_err(|error| JsValue::from_str(&format!("用户数据解析失败：{}", error)))?;

    // 检查 NaN、Infinity 和 -Infinity
    if !user.score.is_finite() {
        return Err(JsValue::from_str("用户 score 必须是有限数值"));
    }

    // 清理姓名首尾空白
    user.name = user.name.trim().to_string();

    // 将 score 限制在 0～100
    user.score = user.score.clamp(0.0, 100.0);

    serde_wasm_bindgen::to_value(&user)
        .map_err(|error| JsValue::from_str(&format!("用户数据转换失败：{}", error)))
}

// ============================================================
// 8. 异步函数与 Promise
// JavaScript调用：
// const result = await calculate_async(10, 20);
// console.log(result);
// ============================================================
#[wasm_bindgen]
pub async fn calculate_async(a: f64, b: f64) -> f64 {
    let delay_ms = if a == 2026.0 { 3_000 } else { 5_000 };

    TimeoutFuture::new(delay_ms).await;

    a + b
}

// ============================================================
// 9. Rust 调用浏览器 API
// ============================================================
// 获取 Window
fn get_window() -> Result<Window, JsValue> {
    web_sys::window().ok_or_else(|| JsValue::from_str("无法获取 Window"))
}

// &[u8] -> 二进制字符串
fn bytes_to_binary_string(bytes: &[u8]) -> String {
    bytes.iter().map(|&byte| char::from(byte)).collect()
}

// 二进制字符串 -> Vec<u8>
fn binary_string_to_bytes(binary: &str) -> Result<Vec<u8>, JsValue> {
    binary
        .chars()
        .map(|character| {
            u8::try_from(character as u32)
                .map_err(|_| JsValue::from_str("二进制字符串中存在超出单字节范围的字符"))
        })
        .collect()
}

// ============================================================
// 二进制 Base64 编码
// Uint8Array -> Base64 String
// ============================================================
#[wasm_bindgen]
pub fn base64_encode_bytes(input: &[u8]) -> Result<String, JsValue> {
    let window = get_window()?;

    let binary = bytes_to_binary_string(input);

    window.btoa(&binary)
}

// ============================================================
// 二进制 Base64 解码
// Base64 String -> Uint8Array
// ============================================================
#[wasm_bindgen]
pub fn base64_decode_bytes(encoded: &str) -> Result<Vec<u8>, JsValue> {
    let window = get_window()?;

    let binary = window.atob(encoded)?;

    binary_string_to_bytes(&binary)
}

// ============================================================
// UTF-8 文本 Base64 编码
// String -> UTF-8 -> Base64 String
// ============================================================
#[wasm_bindgen]
pub fn base64_encode_text(input: &str) -> Result<String, JsValue> {
    base64_encode_bytes(input.as_bytes())
}

// ============================================================
// UTF-8 文本 Base64 解码
// Base64 String -> UTF-8 -> String
// ============================================================
#[wasm_bindgen]
pub fn base64_decode_text(encoded: &str) -> Result<String, JsValue> {
    let bytes = base64_decode_bytes(encoded)?;

    String::from_utf8(bytes).map_err(|error| {
        JsValue::from_str(&format!("Base64 解码成功，但结果不是有效 UTF-8：{}", error))
    })
}

// ============================================================
// 11. Rust 调用JavaScript 原生 API
// ============================================================
#[wasm_bindgen]
pub fn json_parse(text: &str) -> Result<JsValue, JsValue> {
    JSON::parse(text)
}

// ============================================================
// 12. Rust 调用JavaScript 原生 API
// ============================================================
#[wasm_bindgen]
pub fn json_stringify(value: JsValue) -> Result<String, JsValue> {
    // 调用 JavaScript 原生 JSON.stringify()
    let json_string = JSON::stringify(&value)?;

    // JsString -> Rust String
    json_string
        .as_string()
        .ok_or_else(|| JsValue::from_str("JSON.stringify() 没有返回有效的字符串"))
}
