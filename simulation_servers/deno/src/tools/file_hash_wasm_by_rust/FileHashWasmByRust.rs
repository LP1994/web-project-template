use base64::engine::general_purpose::STANDARD;

use base64::Engine as _;

use js_sys::{Object, Reflect};

use md5::{Digest, Md5};

// 哈希算法第1代
use sha1::Sha1;

// 哈希算法第2代
use sha2::{Sha224, Sha256, Sha384, Sha512};

// 哈希算法第3代
use sha3::{Sha3_224, Sha3_256, Sha3_384, Sha3_512};

use wasm_bindgen::prelude::*;

// ============================================================
// 第一部分：输出格式选择及算法别名配置
// ============================================================

/// 某一种算法的一组输出格式选择。
///
/// hex = true：输出十六进制字符串。
/// base64 = true：输出标准 Base64 字符串。
///
/// 两者相互独立，可以只选择其中一种，也可以同时选择。
#[derive(Clone, Copy)]
struct HashOutputSelection {
  hex: bool,

  base64: bool,
}

/// 一种 JavaScript 配置键及其输出格式。
///
/// 例如，用户可以同时提供 sha256 和 sha2-256：
/// - 两者属于同一种 SHA-256 算法；
/// - Rust 内部只维护一个 Sha256 状态；
/// - 最终可以分别写入 sha256 和 sha2-256 两个配置键。
struct SelectedOutput {
  key: &'static str,

  format: HashOutputSelection,
}

/// 保存某一种哈希算法的唯一运行状态，以及一个或多个输出配置键。H 是具体的哈希器类型，例如 Sha1、Sha224、Sha3_256。
struct SelectedHasher<H> {
  hasher: H,

  outputs: Vec<SelectedOutput>,
}

// ============================================================
// 第二部分：FileHasher 结构体
// ============================================================

/// 文件哈希计算器。
///
/// 算法选择和 Hex / Base64 输出格式均由 JavaScript 构造参数决定。
///
/// 注意：sha1 / sha-1、sha256 / sha-256 / sha2-256 等是别名，
/// 每组别名在 Rust 内部只对应一个哈希计算状态，不会重复计算。
#[wasm_bindgen]
pub struct FileHasher {
  md5: Option<SelectedHasher<Md5>>,

  /// 哈希算法第1代
  sha1: Option<SelectedHasher<Sha1>>,

  /// 哈希算法第2代 Start
  sha224: Option<SelectedHasher<Sha224>>,
  sha256: Option<SelectedHasher<Sha256>>,
  sha384: Option<SelectedHasher<Sha384>>,
  sha512: Option<SelectedHasher<Sha512>>,
  /// 哈希算法第2代 End

  /// 哈希算法第3代 Start
  sha3_224: Option<SelectedHasher<Sha3_224>>,
  sha3_256: Option<SelectedHasher<Sha3_256>>,
  sha3_384: Option<SelectedHasher<Sha3_384>>,
  sha3_512: Option<SelectedHasher<Sha3_512>>,
  /// 哈希算法第3代 End

  /// 已经处理的文件总字节数。
  bytes_processed: u64,
}

// ============================================================
// 第三部分：FileHasher 对外导出的方法
// ============================================================

#[wasm_bindgen]
impl FileHasher {
  /// 根据 JavaScript 对象创建哈希计算器。
  ///
  /// 支持的配置键：
  ///
  /// SHA-1：哈希算法第1代
  ///   sha1、sha-1
  ///
  /// SHA-224：哈希算法第2代
  ///   sha224、sha-224、sha2-224
  ///
  /// SHA-256：哈希算法第2代
  ///   sha256、sha-256、sha2-256
  ///
  /// SHA-384：哈希算法第2代
  ///   sha384、sha-384、sha2-384
  ///
  /// SHA-512：哈希算法第2代
  ///   sha512、sha-512、sha2-512
  ///
  /// SHA-3：哈希算法第3代
  ///   sha3-224、sha3-256、sha3-384、sha3-512
  ///
  /// 每个算法配置对象中可以独立提供 hex 和 / 或 base64 属性。
  /// 属性是否存在决定是否选择该输出格式，属性值本身不参与判断。
  ///
  /// 示例：
  /// const options = {
  ///     md5: { hex: "" },
  ///     "sha-1": { hex: "" },
  ///     "sha2-224": { base64: "" },
  ///     "sha256": { hex: "", base64: "" },
  ///     "sha3-512": { hex: "" },
  /// };
  /// const hasher = new FileHasher(options);
  ///
  /// 同一种算法的多个别名可以同时出现。此时只计算一次，
  /// 并将同一摘要按各自配置写入相应的别名键。
  #[wasm_bindgen(constructor)]
  pub fn new(options: JsValue) -> Result<FileHasher, JsValue> {
    if options.is_null_or_undefined() || !options.is_object() {
      return Err(JsValue::from_str(
        "FileHasher 构造参数必须是包含哈希算法配置的 JavaScript 对象。",
      ));
    }

    // 每组别名只解析一次，并将选择结果保存在 outputs 中。
    let md5_outputs = get_output_selections(&options, &["md5"])?;

    // 哈希算法第1代
    let sha1_outputs = get_output_selections(&options, &["sha1", "sha-1"])?;

    // 哈希算法第2代 Start
    let sha224_outputs = get_output_selections(&options, &["sha224", "sha-224", "sha2-224"])?;
    let sha256_outputs = get_output_selections(&options, &["sha256", "sha-256", "sha2-256"])?;
    let sha384_outputs = get_output_selections(&options, &["sha384", "sha-384", "sha2-384"])?;
    let sha512_outputs = get_output_selections(&options, &["sha512", "sha-512", "sha2-512"])?;
    // 哈希算法第2代 End

    // 哈希算法第3代 Start
    let sha3_224_outputs = get_output_selections(&options, &["sha3-224"])?;
    let sha3_256_outputs = get_output_selections(&options, &["sha3-256"])?;
    let sha3_384_outputs = get_output_selections(&options, &["sha3-384"])?;
    let sha3_512_outputs = get_output_selections(&options, &["sha3-512"])?;
    // 哈希算法第3代 End

    // 至少需要选择一种实际算法。
    if md5_outputs.is_empty()
      && sha1_outputs.is_empty()
      && sha224_outputs.is_empty()
      && sha256_outputs.is_empty()
      && sha384_outputs.is_empty()
      && sha512_outputs.is_empty()
      && sha3_224_outputs.is_empty()
      && sha3_256_outputs.is_empty()
      && sha3_384_outputs.is_empty()
      && sha3_512_outputs.is_empty()
    {
      return Err(JsValue::from_str(
        "至少需要选择一种哈希算法：MD5、SHA-1、SHA-224/256/384/512 或 SHA3-224/256/384/512。",
      ));
    }

    Ok(FileHasher {
      // 空 Vec 表示该算法未选择，不会初始化对应的哈希器。
      md5: make_selected_hasher::<Md5>(md5_outputs),
      // 哈希算法第1代
      sha1: make_selected_hasher::<Sha1>(sha1_outputs),
      // 哈希算法第2代 Start
      sha224: make_selected_hasher::<Sha224>(sha224_outputs),
      sha256: make_selected_hasher::<Sha256>(sha256_outputs),
      sha384: make_selected_hasher::<Sha384>(sha384_outputs),
      sha512: make_selected_hasher::<Sha512>(sha512_outputs),
      // 哈希算法第2代 End
      // 哈希算法第3代 Start
      sha3_224: make_selected_hasher::<Sha3_224>(sha3_224_outputs),
      sha3_256: make_selected_hasher::<Sha3_256>(sha3_256_outputs),
      sha3_384: make_selected_hasher::<Sha3_384>(sha3_384_outputs),
      sha3_512: make_selected_hasher::<Sha3_512>(sha3_512_outputs),
      // 哈希算法第3代 End
      bytes_processed: 0,
    })
  }

  /// 向所有已启用的唯一哈希算法输入一块文件数据。
  ///
  /// chunk: &[u8] 对应 JavaScript 的 Uint8Array。
  ///
  /// 不同别名不会导致重复更新：例如 sha256 和 sha2-256
  /// 在内部共用同一个 Sha256 状态。
  #[wasm_bindgen(js_name = update)]
  pub fn update(&mut self, chunk: &[u8]) -> Result<(), JsValue> {
    let chunk_len = u64::try_from(chunk.len()).map_err(|_| JsValue::from_str("文件分块长度超出了 u64 的表示范围。"))?;

    let next_total = self
      .bytes_processed
      .checked_add(chunk_len)
      .ok_or_else(|| JsValue::from_str("累计处理的文件字节数超出了 u64 的表示范围。"))?;

    // 每个实际算法只更新一次。
    if let Some(selected) = self.md5.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha1.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha224.as_mut() {
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

    if let Some(selected) = self.sha3_224.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha3_256.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha3_384.as_mut() {
      selected.hasher.update(chunk);
    }

    if let Some(selected) = self.sha3_512.as_mut() {
      selected.hasher.update(chunk);
    }

    self.bytes_processed = next_total;

    Ok(())
  }

  /// 获取当前已输入数据的哈希结果。
  ///
  /// 只返回构造时选择的算法别名及其编码格式。
  /// 通过 clone() 计算快照，不会消耗原始哈希状态。
  #[wasm_bindgen(js_name = digest)]
  pub fn digest(&self) -> Result<JsValue, JsValue> {
    let result: JsValue = Object::new().into();

    self.write_result(&result)?;

    Ok(result)
  }

  /// 将当前哈希结果写入 JavaScript 传入的对象，并返回同一对象。
  ///
  /// 如果目标对象缺少选中算法的子对象或编码属性，会自动创建。
  /// 只写入构造时所选的别名和编码格式。
  #[wasm_bindgen(js_name = digestInto)]
  pub fn digest_into(&self, result: JsValue) -> Result<JsValue, JsValue> {
    self.write_result(&result)?;

    Ok(result)
  }

  /// 获取已经处理的总字节数；JavaScript 中对应 BigInt。
  #[wasm_bindgen(js_name = bytesProcessed)]
  pub fn bytes_processed(&self) -> u64 {
    self.bytes_processed
  }

  /// 重置所有已启用算法的状态，但保留算法别名及编码格式选择。
  #[wasm_bindgen(js_name = reset)]
  pub fn reset(&mut self) {
    if let Some(selected) = self.md5.as_mut() {
      selected.hasher = Md5::new();
    }

    if let Some(selected) = self.sha1.as_mut() {
      selected.hasher = Sha1::new();
    }

    if let Some(selected) = self.sha224.as_mut() {
      selected.hasher = Sha224::new();
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

    if let Some(selected) = self.sha3_224.as_mut() {
      selected.hasher = Sha3_224::new();
    }

    if let Some(selected) = self.sha3_256.as_mut() {
      selected.hasher = Sha3_256::new();
    }

    if let Some(selected) = self.sha3_384.as_mut() {
      selected.hasher = Sha3_384::new();
    }

    if let Some(selected) = self.sha3_512.as_mut() {
      selected.hasher = Sha3_512::new();
    }

    self.bytes_processed = 0;
  }
}

// ============================================================
// 第四部分：创建可选的哈希状态
// ============================================================

/// 没有任何输出别名时返回 None；否则才初始化哈希器。
fn make_selected_hasher<H: Digest>(outputs: Vec<SelectedOutput>) -> Option<SelectedHasher<H>> {
  if outputs.is_empty() {
    None
  } else {
    Some(SelectedHasher {
      hasher: H::new(),
      outputs,
    })
  }
}

// ============================================================
// 第五部分：解析 JavaScript 算法配置和 Hex / Base64 选择
// ============================================================

/// 对 aliases 中的每一个键检查是否被选择。
///
/// 返回一个或多个输出键。多个别名如果指向同一种算法，
/// 会共用一个哈希状态，但各自保留独立的 Hex / Base64 输出设置。
fn get_output_selections(options: &JsValue, aliases: &[&'static str]) -> Result<Vec<SelectedOutput>, JsValue> {
  let options_object = Object::try_from(options).ok_or_else(|| JsValue::from_str("哈希算法配置必须是一个 JavaScript 对象。"))?;

  let mut selections = Vec::new();

  for &algorithm_key in aliases {
    // 只检查配置对象自身的属性，不检查原型链。
    let has_algorithm = Object::has_own(options_object, &JsValue::from_str(algorithm_key));

    if !has_algorithm {
      continue;
    }

    let algorithm_value = Reflect::get(options, &JsValue::from_str(algorithm_key))?;

    if algorithm_value.is_null() || !algorithm_value.is_object() {
      return Err(JsValue::from_str(&format!(
        "哈希算法配置 {} 必须是一个非 null JavaScript 对象。",
        algorithm_key
      )));
    }

    let algorithm_object = Object::try_from(&algorithm_value).ok_or_else(|| {
      JsValue::from_str(&format!(
        "哈希算法配置 {} 必须是一个 JavaScript 对象。",
        algorithm_key
      ))
    })?;

    let use_hex = Object::has_own(algorithm_object, &JsValue::from_str("hex"));

    let use_base64 = Object::has_own(algorithm_object, &JsValue::from_str("base64"));

    if !use_hex && !use_base64 {
      return Err(JsValue::from_str(&format!(
        "哈希算法配置 {} 至少需要包含 hex 或 base64 属性。",
        algorithm_key
      )));
    }

    selections.push(SelectedOutput {
      key: algorithm_key,
      format: HashOutputSelection {
        hex: use_hex,
        base64: use_base64,
      },
    });
  }

  Ok(selections)
}

// ============================================================
// 第六部分：生成选中算法的摘要，并写入一个或多个别名键
// ============================================================

impl FileHasher {
  fn write_result(&self, result: &JsValue) -> Result<(), JsValue> {
    if result.is_null_or_undefined() || !result.is_object() {
      return Err(JsValue::from_str(
        "哈希结果接收参数必须是一个 JavaScript 对象。",
      ));
    }

    if let Some(selected) = self.md5.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha1.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha224.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha256.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha384.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha512.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha3_224.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha3_256.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha3_384.as_ref() {
      write_selected_hash(result, selected)?;
    }

    if let Some(selected) = self.sha3_512.as_ref() {
      write_selected_hash(result, selected)?;
    }

    Ok(())
  }
}

/// 对同一种实际算法只 finalize 一次，然后将摘要写入配置中的所有别名键。
fn write_selected_hash<H>(target: &JsValue, selected: &SelectedHasher<H>) -> Result<(), JsValue>
where
  H: Digest + Clone,
{
  // finalize() 会消耗哈希状态，所以先克隆，保留原始状态供后续 update() 使用。
  let digest = selected.hasher.clone().finalize();

  for output in &selected.outputs {
    write_one_hash(target, output.key, &digest[..], output.format)?;
  }

  Ok(())
}

// ============================================================
// 第七部分：按要求的格式转换并写入单个输出键
// ============================================================

fn write_one_hash(target: &JsValue, algorithm_key: &str, digest: &[u8], output: HashOutputSelection) -> Result<(), JsValue> {
  let mut section = Reflect::get(target, &JsValue::from_str(algorithm_key))?;

  // 如果结果对象中没有该算法子对象，则自动创建。
  if section.is_null_or_undefined() {
    let new_section: JsValue = Object::new().into();

    set_property(target, algorithm_key, &new_section)?;

    section = new_section;
  }

  if !section.is_object() {
    return Err(JsValue::from_str(&format!(
      "哈希结果对象中的 {} 属性必须是一个对象。",
      algorithm_key
    )));
  }

  // 只有选择 Hex 时才执行 Hex 编码并写入 hex 属性。
  if output.hex {
    let hex_value = hex::encode(digest);

    set_property(&section, "hex", &JsValue::from_str(&hex_value))?;
  }

  // 只有选择 Base64 时才执行 Base64 编码并写入 base64 属性。
  if output.base64 {
    let base64_value = STANDARD.encode(digest);

    set_property(&section, "base64", &JsValue::from_str(&base64_value))?;
  }

  Ok(())
}

// ============================================================
// 第八部分：JavaScript 对象属性写入工具
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
