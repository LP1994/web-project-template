use base64::engine::general_purpose::STANDARD;

use base64::Engine as _;

use js_sys::{Object, Reflect};

use md5::{Digest, Md5};

use sha2::{Sha256, Sha384, Sha512};

use wasm_bindgen::prelude::*;

// ============================================================
// 第一部分：FileHasher 结构体
// ============================================================

/// 文件哈希计算器。
///
/// 一个 FileHasher 实例同时维护四种哈希算法的内部状态：
///
/// 1. MD5
/// 2. SHA-256
/// 3. SHA-384
/// 4. SHA-512
///
/// 每次调用 update() 时，四种算法都会接收相同的文件数据。
///
/// 因此，最终只需要遍历一次文件，就可以得到四种哈希结果。
#[wasm_bindgen]
pub struct FileHasher {
  /// MD5 哈希计算器。
  md5: Md5,

  /// SHA-256 哈希计算器。
  sha256: Sha256,

  /// SHA-384 哈希计算器。
  sha384: Sha384,

  /// SHA-512 哈希计算器。
  sha512: Sha512,

  /// 已经处理的文件字节数。
  ///
  /// 使用 u64，而不是 u32，是为了支持更大的文件。
  bytes_processed: u64,
}

// ============================================================
// 第二部分：FileHasher 对外导出的方法
// ============================================================

#[wasm_bindgen]
impl FileHasher {
  /// 创建一个新的 FileHasher 实例。
  ///
  /// JavaScript:
  ///
  /// const hasher = new FileHasher();
  ///
  #[wasm_bindgen(constructor)]
  pub fn new() -> FileHasher {
    FileHasher {
      // 初始化 MD5。
      md5: Md5::new(),

      // 初始化 SHA-256。
      sha256: Sha256::new(),

      // 初始化 SHA-384。
      sha384: Sha384::new(),

      // 初始化 SHA-512。
      sha512: Sha512::new(),

      // 初始处理字节数为 0。
      bytes_processed: 0,
    }
  }

  /// 向四种哈希计算器输入一块文件数据。
  ///
  /// chunk 对应 JavaScript 中的 Uint8Array。
  ///
  /// JavaScript:
  ///
  /// hasher.update(chunk);
  ///
  #[wasm_bindgen(js_name = update)]
  pub fn update(&mut self, chunk: &[u8]) -> Result<(), JsValue> {
    // ----------------------------------------------------
    // 1. 计算本次输入的字节数。
    // ----------------------------------------------------

    let chunk_len = u64::try_from(chunk.len()).map_err(|_| JsValue::from_str("文件分块长度超出了 u64 的表示范围。"))?;

    // ----------------------------------------------------
    // 2. 计算累计处理的字节数。
    // ----------------------------------------------------

    let next_total = self
      .bytes_processed
      .checked_add(chunk_len)
      .ok_or_else(|| JsValue::from_str("累计处理的文件字节数超出了 u64 的表示范围。"))?;

    // ----------------------------------------------------
    // 3. 将当前 chunk 输入 MD5。
    // ----------------------------------------------------

    self.md5.update(chunk);

    // ----------------------------------------------------
    // 4. 将当前 chunk 输入 SHA-256。
    // ----------------------------------------------------

    self.sha256.update(chunk);

    // ----------------------------------------------------
    // 5. 将当前 chunk 输入 SHA-384。
    // ----------------------------------------------------

    self.sha384.update(chunk);

    // ----------------------------------------------------
    // 6. 将当前 chunk 输入 SHA-512。
    // ----------------------------------------------------

    self.sha512.update(chunk);

    // ----------------------------------------------------
    // 7. 更新已处理字节数。
    // ----------------------------------------------------

    self.bytes_processed = next_total;

    // 本次数据处理成功。
    Ok(())
  }

  /// 获取当前已经计算的数据所对应的所有哈希值。
  ///
  /// 此方法不会清空或消耗原来的哈希计算器。
  ///
  /// JavaScript:
  ///
  /// const result = hasher.digest();
  ///
  #[wasm_bindgen(js_name = digest)]
  pub fn digest(&self) -> Result<JsValue, JsValue> {
    // 创建一个新的 JavaScript 对象。
    let result: JsValue = Object::new().into();

    // 将四种哈希结果写入新对象。
    self.write_result(&result)?;

    // 返回 JavaScript 对象。
    Ok(result)
  }

  /// 将计算得到的哈希值写入 JavaScript 传入的对象。
  ///
  /// JavaScript:
  ///
  /// const result = hasher.digestInto(hashResult);
  ///
  /// 返回的就是原来的 hashResult 对象。
  ///
  #[wasm_bindgen(js_name = digestInto)]
  pub fn digest_into(&self, result: JsValue) -> Result<JsValue, JsValue> {
    // 将结果写入用户传入的 JavaScript 对象。
    self.write_result(&result)?;

    // 返回原来的 JavaScript 对象。
    Ok(result)
  }

  /// 获取已经处理的字节数。
  ///
  /// Rust u64 在 JavaScript 中对应 BigInt。
  ///
  /// JavaScript:
  ///
  /// const size = hasher.bytesProcessed();
  ///
  #[wasm_bindgen(js_name = bytesProcessed)]
  pub fn bytes_processed(&self) -> u64 {
    self.bytes_processed
  }

  /// 重置四种哈希计算器。
  ///
  /// 调用之后，FileHasher 可以重新计算另一个文件。
  ///
  /// JavaScript:
  ///
  /// hasher.reset();
  ///
  #[wasm_bindgen(js_name = reset)]
  pub fn reset(&mut self) {
    self.md5 = Md5::new();

    self.sha256 = Sha256::new();

    self.sha384 = Sha384::new();

    self.sha512 = Sha512::new();

    self.bytes_processed = 0;
  }
}

// ============================================================
// 第三部分：将全部哈希结果写入 JavaScript 对象
// ============================================================

impl FileHasher {
  /// 将四种哈希计算结果写入指定的 JavaScript 对象。
  ///
  /// 这是 Rust 内部使用的方法，不会直接导出给 JS。
  fn write_result(&self, result: &JsValue) -> Result<(), JsValue> {
    // 确保 result 是有效的 JavaScript 对象。
    if result.is_null_or_undefined() || !result.is_object() {
      return Err(JsValue::from_str(
        "哈希结果接收参数必须是一个 JavaScript 对象。",
      ));
    }

    // ----------------------------------------------------
    // 1. 计算 MD5。
    // ----------------------------------------------------

    // clone() 复制当前哈希计算状态。
    // finalize() 只消耗复制出来的状态。
    let md5_digest = self.md5.clone().finalize();

    // 将 MD5 结果写入 md5 对象。
    write_one_hash(result, "md5", &md5_digest[..])?;

    // ----------------------------------------------------
    // 2. 计算 SHA-256。
    // ----------------------------------------------------

    let sha256_digest = self.sha256.clone().finalize();

    write_one_hash(result, "sha256", &sha256_digest[..])?;

    // ----------------------------------------------------
    // 3. 计算 SHA-384。
    // ----------------------------------------------------

    let sha384_digest = self.sha384.clone().finalize();

    write_one_hash(result, "sha384", &sha384_digest[..])?;

    // ----------------------------------------------------
    // 4. 计算 SHA-512。
    // ----------------------------------------------------

    let sha512_digest = self.sha512.clone().finalize();

    write_one_hash(result, "sha512", &sha512_digest[..])?;

    Ok(())
  }
}

// ============================================================
// 第四部分：处理单种哈希算法的结果
// ============================================================

/// 将某种哈希算法的二进制结果转换为 Hex 和 Base64，
/// 然后写入对应的 JavaScript 子对象。
///
/// 参数：
///
/// target:
///     JavaScript 最外层结果对象。
///
/// algorithm:
///     哈希算法名称，例如 "md5"、"sha256"。
///
/// digest:
///     该算法最终计算得到的原始二进制哈希值。
fn write_one_hash(target: &JsValue, algorithm: &str, digest: &[u8]) -> Result<(), JsValue> {
  // --------------------------------------------------------
  // 1. 获取对应算法的子对象。
  // --------------------------------------------------------

  // 相当于 JavaScript：
  //
  // let section = target[algorithm];
  //
  let mut section = Reflect::get(target, &JsValue::from_str(algorithm))?;

  // --------------------------------------------------------
  // 2. 如果对应的子对象不存在，则自动创建。
  // --------------------------------------------------------

  if section.is_null_or_undefined() {
    // 创建新的 JavaScript Object。
    let new_section: JsValue = Object::new().into();

    // 将新对象添加到最外层对象。
    //
    // 相当于：
    //
    // target[algorithm] = {};
    //
    set_property(target, algorithm, &new_section)?;

    section = new_section;
  }

  // 如果现有的子对象不是对象，则无法写入。
  if !section.is_object() {
    return Err(JsValue::from_str(
      "哈希结果对象中的算法属性必须是一个对象。",
    ));
  }

  // --------------------------------------------------------
  // 3. 将原始二进制哈希值转换为 Hex。
  // --------------------------------------------------------

  // 例如：
  //
  // [0x5e, 0xb6, 0x3b, ...]
  //
  // 转换为：
  //
  // "5eb63b..."
  //
  let hex_value = hex::encode(digest);

  // --------------------------------------------------------
  // 4. 将原始二进制哈希值转换为 Base64。
  // --------------------------------------------------------

  // 使用标准 Base64 编码。
  //
  // STANDARD 使用标准 Base64 字符表并保留必要的 "=" 填充。
  //
  let base64_value = STANDARD.encode(digest);

  // --------------------------------------------------------
  // 5. 写入 Hex。
  // --------------------------------------------------------

  set_property(&section, "hex", &JsValue::from_str(&hex_value))?;

  // --------------------------------------------------------
  // 6. 写入 Base64。
  // --------------------------------------------------------

  set_property(&section, "base64", &JsValue::from_str(&base64_value))?;

  Ok(())
}

// ============================================================
// 第五部分：JavaScript 对象属性写入工具
// ============================================================

/// 向 JavaScript 对象写入指定属性。
///
/// 等价于：
///
/// target[property] = value;
///
/// 如果 JavaScript Reflect.set() 返回 false，
/// 则将其转换为 Rust 错误并返回给 JavaScript。
fn set_property(target: &JsValue, property: &str, value: &JsValue) -> Result<(), JsValue> {
  // 将属性名称转换为 JavaScript 字符串。
  let property_key = JsValue::from_str(property);

  // 使用 Reflect.set 修改 JavaScript 对象。
  let success = Reflect::set(target, &property_key, value)?;

  // Reflect.set 返回 false 表示属性没有成功写入。
  if !success {
    return Err(JsValue::from_str(&format!(
      "无法写入 JavaScript 对象属性：{}",
      property
    )));
  }

  Ok(())
}
