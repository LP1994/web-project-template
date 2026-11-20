use base64::engine::general_purpose::STANDARD;

use base64::Engine as _;

use js_sys::{Object, Reflect};

use md5::{Digest, Md5};

use sha2::{Sha256, Sha384, Sha512};

use wasm_bindgen::prelude::*;

// ============================================================
// 第一部分：哈希输出格式配置及哈希状态
// ============================================================

/// 某一种哈希算法需要输出哪些编码格式。
///
/// hex = true：输出十六进制字符串。
/// base64 = true：输出标准 Base64 字符串。
///
/// 两个字段相互独立，可以只启用其中一个，也可以同时启用。
#[derive(Clone, Copy)]
struct HashOutputSelection {
  hex: bool,

  base64: bool,
}

/// 保存某一种哈希算法的运行状态及其输出格式选择。
/// H 是具体的哈希器类型，例如 Md5、Sha256、Sha384 或 Sha512。
struct SelectedHasher<H> {
  /// 增量哈希计算器。
  hasher: H,

  /// 该算法需要输出的格式。
  output: HashOutputSelection,
}

// ============================================================
// 第二部分：FileHasher 结构体
// ============================================================

/// 文件哈希计算器。
///
/// 算法选择和输出格式都由 JavaScript 构造参数决定。
///
/// 例如：
/// {
///     md5: { hex: "" },
///     sha256: { base64: "" },
/// }
///
/// 表示：
/// 1. 启用 MD5，只输出 Hex。
/// 2. 启用 SHA-256，只输出 Base64。
/// 3. 不启用 SHA-384 和 SHA-512。
#[wasm_bindgen]
pub struct FileHasher {
  /// 未选择 MD5 时为 None；选择时保存 MD5 状态及输出格式。
  md5: Option<SelectedHasher<Md5>>,

  /// 未选择 SHA-256 时为 None。
  sha256: Option<SelectedHasher<Sha256>>,

  /// 未选择 SHA-384 时为 None。
  sha384: Option<SelectedHasher<Sha384>>,

  /// 未选择 SHA-512 时为 None。
  sha512: Option<SelectedHasher<Sha512>>,

  /// 已经处理的文件总字节数。
  bytes_processed: u64,
}

// ============================================================
// 第三部分：FileHasher 对外导出的方法
// ============================================================

#[wasm_bindgen]
impl FileHasher {
  /// 根据 JavaScript 传入的配置对象创建哈希计算器。
  ///
  /// 构造参数同时决定：
  /// 1. 启用哪些哈希算法；
  /// 2. 每种算法需要输出 Hex、Base64，还是两者都输出。
  ///
  /// JavaScript 示例：
  ///
  /// const options = {
  ///     md5: { hex: "" },
  ///     sha256: { base64: "" },
  ///     sha384: { hex: "", base64: "" },
  /// };
  ///
  /// const hasher = new FileHasher(options);
  ///
  /// 配置规则：
  /// - md5 / sha256 / sha384 / sha512 属性决定是否启用对应算法。
  /// - 对应算法对象中存在 hex 属性，就选择 Hex 输出。
  /// - 对应算法对象中存在 base64 属性，就选择 Base64 输出。
  /// - hex 和 base64 可以单独选择，也可以同时选择。
  /// - 算法对象必须至少包含 hex 或 base64 中的一个属性。
  /// - 没有选择任何算法时返回错误。
  #[wasm_bindgen(constructor)]
  pub fn new(options: JsValue) -> Result<FileHasher, JsValue> {
    // 构造参数必须是 JavaScript 对象。
    if options.is_null_or_undefined() || !options.is_object() {
      return Err(JsValue::from_str(
        "FileHasher 构造参数必须是包含哈希算法配置的 JavaScript 对象。",
      ));
    }

    // 读取各算法配置。None 表示不启用该算法；Some(...) 表示启用，并保存编码选择。
    let md5_output = get_output_selection(&options, "md5")?;
    let sha256_output = get_output_selection(&options, "sha256")?;
    let sha384_output = get_output_selection(&options, "sha384")?;
    let sha512_output = get_output_selection(&options, "sha512")?;

    // 至少需要选择一种算法。
    if md5_output.is_none() && sha256_output.is_none() && sha384_output.is_none() && sha512_output.is_none() {
      return Err(JsValue::from_str(
        "至少需要指定一种哈希算法：md5、sha256、sha384 或 sha512。",
      ));
    }

    Ok(FileHasher {
      // 只初始化用户选择的算法，并保存对应的输出格式。
      md5: md5_output.map(|output| SelectedHasher {
        hasher: Md5::new(),
        output,
      }),

      sha256: sha256_output.map(|output| SelectedHasher {
        hasher: Sha256::new(),
        output,
      }),

      sha384: sha384_output.map(|output| SelectedHasher {
        hasher: Sha384::new(),
        output,
      }),

      sha512: sha512_output.map(|output| SelectedHasher {
        hasher: Sha512::new(),
        output,
      }),

      bytes_processed: 0,
    })
  }

  /// 向已启用的哈希计算器输入一块文件数据。
  ///
  /// chunk: &[u8] 对应 JavaScript 的 Uint8Array。
  ///
  /// 只有构造函数中选中的算法才会更新状态。
  /// Hex / Base64 是最终摘要的输出格式，不影响 update() 的输入方式。
  ///
  /// JavaScript：
  /// hasher.update(chunk);
  #[wasm_bindgen(js_name = update)]
  pub fn update(&mut self, chunk: &[u8]) -> Result<(), JsValue> {
    // 计算本次输入的字节数。
    let chunk_len = u64::try_from(chunk.len()).map_err(|_| JsValue::from_str("文件分块长度超出了 u64 的表示范围。"))?;

    // 先检查累计字节数是否溢出，避免更新哈希状态后才发现计数溢出。
    let next_total = self
      .bytes_processed
      .checked_add(chunk_len)
      .ok_or_else(|| JsValue::from_str("累计处理的文件字节数超出了 u64 的表示范围。"))?;

    // 只更新被选择的哈希算法。
    if let Some(selected) = self.md5.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha256.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha384.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha512.as_mut() {
      selected.hasher.update(chunk);
    }

    // 更新累计处理字节数。
    self.bytes_processed = next_total;

    Ok(())
  }

  /// 获取当前已输入数据的哈希结果。
  ///
  /// 只返回构造时选中的算法和编码格式。
  /// 此方法通过 clone() 复制哈希状态，不会消耗原始状态，
  /// 因此调用 digest() 后仍然可以继续 update()。
  ///
  /// JavaScript：
  /// const result = hasher.digest();
  #[wasm_bindgen(js_name = digest)]
  pub fn digest(&self) -> Result<JsValue, JsValue> {
    let result: JsValue = Object::new().into();

    self.write_result(&result)?;

    Ok(result)
  }

  /// 将当前已输入数据的哈希结果写入 JavaScript 传入对象。
  ///
  /// 只写入构造时选中的算法及编码格式。
  /// 如果目标对象缺少对应算法子对象或输出属性，会自动创建。
  /// 未选择的编码属性不会被生成或覆盖。
  ///
  /// JavaScript：
  /// const result = hasher.digestInto(resultObject);
  #[wasm_bindgen(js_name = digestInto)]
  pub fn digest_into(&self, result: JsValue) -> Result<JsValue, JsValue> {
    self.write_result(&result)?;

    Ok(result)
  }

  /// 获取已经处理的总字节数。Rust u64 在 JavaScript 中映射为 BigInt。
  #[wasm_bindgen(js_name = bytesProcessed)]
  pub fn bytes_processed(&self) -> u64 {
    self.bytes_processed
  }

  /// 重置已启用的哈希计算器及累计字节数。算法选择和 Hex / Base64 输出格式选择保持不变。
  #[wasm_bindgen(js_name = reset)]
  pub fn reset(&mut self) {
    if let Some(selected) = self.md5.as_mut() {
      selected.hasher = Md5::new();
    }

    if let Some(selected) = self.sha256.as_mut() {
      selected.hasher = Sha256::new();
    }

    if let Some(selected) = self.sha384.as_mut() {
      selected.hasher = Sha384::new();
    }

    if let Some(selected) = self.sha512.as_mut() {
      selected.hasher = Sha512::new();
    }

    self.bytes_processed = 0;
  }
}

// ============================================================
// 第四部分：读取 JavaScript 对象中的算法及输出格式选择
// ============================================================

/// 读取某一种算法的输出格式配置。
///
/// 返回值：
/// - Ok(None)：没有选择该算法。
/// - Ok(Some(selection))：选择了该算法，并记录 Hex / Base64 选项。
/// - Err(...)：配置类型错误，或选择了算法但没有指定输出格式。
///
/// 判断方式是检查属性是否存在，而不是检查属性值是否为空字符串。
/// 因此 { hex: "" } 和 { base64: "" } 都是有效配置。
fn get_output_selection(options: &JsValue, algorithm: &str) -> Result<Option<HashOutputSelection>, JsValue> {
  // 只把 options 自身拥有的算法属性视为用户选择。这样不会因为对象原型链上存在同名属性而意外启用算法。
  let options_object = Object::try_from(options).ok_or_else(|| JsValue::from_str("哈希算法配置必须是一个 JavaScript 对象。"))?;

  let has_algorithm = Object::has_own(options_object, &JsValue::from_str(algorithm));

  // 没有自己的该算法属性，表示未选择该算法。
  if !has_algorithm {
    return Ok(None);
  }

  // 获取 options[algorithm]。
  let algorithm_value = Reflect::get(options, &JsValue::from_str(algorithm))?;

  // 算法配置必须是非 null 对象。
  if algorithm_value.is_null() || !algorithm_value.is_object() {
    return Err(JsValue::from_str(&format!(
      "哈希算法配置 {} 必须是一个对象。",
      algorithm
    )));
  }

  // 检查算法配置对象自身是否具有 hex / base64 属性。
  // 只检查自身属性，不把原型链上的同名属性当成用户选择。
  // 属性值可以是空字符串，因为判断依据是属性是否存在。
  let algorithm_object = Object::try_from(&algorithm_value).ok_or_else(|| {
    JsValue::from_str(&format!(
      "哈希算法配置 {} 必须是一个 JavaScript 对象。",
      algorithm
    ))
  })?;

  let use_hex = Object::has_own(algorithm_object, &JsValue::from_str("hex"));

  let use_base64 = Object::has_own(algorithm_object, &JsValue::from_str("base64"));

  // 选择了算法，却没有指定任何输出格式，属于无效配置。
  if !use_hex && !use_base64 {
    return Err(JsValue::from_str(&format!(
      "哈希算法配置 {} 至少需要包含 hex 或 base64 属性。",
      algorithm
    )));
  }

  Ok(Some(HashOutputSelection {
    hex: use_hex,
    base64: use_base64,
  }))
}

// ============================================================
// 第五部分：将选中算法的结果写入 JavaScript 对象
// ============================================================

impl FileHasher {
  /// 将所有已启用算法的当前摘要写入 result。每种算法只生成配置中选择的编码格式。
  fn write_result(&self, result: &JsValue) -> Result<(), JsValue> {
    if result.is_null_or_undefined() || !result.is_object() {
      return Err(JsValue::from_str(
        "哈希结果接收参数必须是一个 JavaScript 对象。",
      ));
    }

    if let Some(selected) = self.md5.as_ref() {
      write_selected_hash(result, "md5", selected)?;
    }

    if let Some(selected) = self.sha256.as_ref() {
      write_selected_hash(result, "sha256", selected)?;
    }

    if let Some(selected) = self.sha384.as_ref() {
      write_selected_hash(result, "sha384", selected)?;
    }

    if let Some(selected) = self.sha512.as_ref() {
      write_selected_hash(result, "sha512", selected)?;
    }

    Ok(())
  }
}

/// 对选中的哈希器复制当前状态并生成摘要，然后按配置编码。H 可以是 Md5、Sha256、Sha384 或 Sha512。
fn write_selected_hash<H>(target: &JsValue, algorithm: &str, selected: &SelectedHasher<H>) -> Result<(), JsValue>
where
  H: Digest + Clone,
{
  // finalize() 消耗哈希器，因此先 clone()，保留原始增量计算状态。
  let digest = selected.hasher.clone().finalize();

  // 只执行用户选择的编码操作。
  write_one_hash(target, algorithm, &digest[..], selected.output)
}

// ============================================================
// 第六部分：按选择的格式转换并写入单种哈希结果
// ============================================================

/// 将某一种哈希算法的原始摘要转换为用户选择的编码格式。
///
/// 注意：
/// - output.hex 为 true 时才调用 hex::encode()。
/// - output.base64 为 true 时才调用 STANDARD.encode()。
/// - 未选择的编码不会生成字符串，也不会写入对象。
fn write_one_hash(target: &JsValue, algorithm: &str, digest: &[u8], output: HashOutputSelection) -> Result<(), JsValue> {
  // 获取 target[algorithm]。
  let mut section = Reflect::get(target, &JsValue::from_str(algorithm))?;

  // 如果算法子对象不存在，则创建一个。
  if section.is_null_or_undefined() {
    let new_section: JsValue = Object::new().into();

    set_property(target, algorithm, &new_section)?;

    section = new_section;
  }

  // 已存在的算法属性必须是对象。
  if !section.is_object() {
    return Err(JsValue::from_str(&format!(
      "哈希结果对象中的 {} 属性必须是一个对象。",
      algorithm
    )));
  }

  // 只有选择 Hex 时才进行 Hex 编码。
  if output.hex {
    let hex_value = hex::encode(digest);

    set_property(&section, "hex", &JsValue::from_str(&hex_value))?;
  }

  // 只有选择 Base64 时才进行 Base64 编码。
  if output.base64 {
    let base64_value = STANDARD.encode(digest);

    set_property(&section, "base64", &JsValue::from_str(&base64_value))?;
  }

  Ok(())
}

// ============================================================
// 第七部分：JavaScript 对象属性写入工具
// ============================================================

/// 等价于 JavaScript：target[property] = value。
fn set_property(target: &JsValue, property: &str, value: &JsValue) -> Result<(), JsValue> {
  let property_key = JsValue::from_str(property);

  let success = Reflect::set(target, &property_key, value)?;

  if !success {
    return Err(JsValue::from_str(&format!(
      "无法写入 JavaScript 对象属性：{}",
      property
    )));
  }

  Ok(())
}
