/* tslint:disable */
/* eslint-disable */

/**
 * 文件哈希计算器。
 *
 * 算法选择和输出格式都由 JavaScript 构造参数决定。
 *
 * 例如：
 * {
 *     md5: { hex: "" },
 *     sha256: { base64: "" },
 * }
 *
 * 表示：
 * 1. 启用 MD5，只输出 Hex。
 * 2. 启用 SHA-256，只输出 Base64。
 * 3. 不启用 SHA-384 和 SHA-512。
 */
export class FileHasher {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 获取已经处理的总字节数。Rust u64 在 JavaScript 中映射为 BigInt。
     */
    bytesProcessed(): bigint;
    /**
     * 将当前已输入数据的哈希结果写入 JavaScript 传入对象。
     *
     * 只写入构造时选中的算法及编码格式。
     * 如果目标对象缺少对应算法子对象或输出属性，会自动创建。
     * 未选择的编码属性不会被生成或覆盖。
     *
     * JavaScript：
     * const result = hasher.digestInto(resultObject);
     */
    digestInto(result: any): any;
    /**
     * 获取当前已输入数据的哈希结果。
     *
     * 只返回构造时选中的算法和编码格式。
     * 此方法通过 clone() 复制哈希状态，不会消耗原始状态，
     * 因此调用 digest() 后仍然可以继续 update()。
     *
     * JavaScript：
     * const result = hasher.digest();
     */
    digest(): any;
    /**
     * 根据 JavaScript 传入的配置对象创建哈希计算器。
     *
     * 构造参数同时决定：
     * 1. 启用哪些哈希算法；
     * 2. 每种算法需要输出 Hex、Base64，还是两者都输出。
     *
     * JavaScript 示例：
     *
     * const options = {
     *     md5: { hex: "" },
     *     sha256: { base64: "" },
     *     sha384: { hex: "", base64: "" },
     * };
     *
     * const hasher = new FileHasher(options);
     *
     * 配置规则：
     * - md5 / sha256 / sha384 / sha512 属性决定是否启用对应算法。
     * - 对应算法对象中存在 hex 属性，就选择 Hex 输出。
     * - 对应算法对象中存在 base64 属性，就选择 Base64 输出。
     * - hex 和 base64 可以单独选择，也可以同时选择。
     * - 算法对象必须至少包含 hex 或 base64 中的一个属性。
     * - 没有选择任何算法时返回错误。
     */
    constructor(options: any);
    /**
     * 重置已启用的哈希计算器及累计字节数。算法选择和 Hex / Base64 输出格式选择保持不变。
     */
    reset(): void;
    /**
     * 向已启用的哈希计算器输入一块文件数据。
     *
     * chunk: &[u8] 对应 JavaScript 的 Uint8Array。
     *
     * 只有构造函数中选中的算法才会更新状态。
     * Hex / Base64 是最终摘要的输出格式，不影响 update() 的输入方式。
     *
     * JavaScript：
     * hasher.update(chunk);
     */
    update(chunk: Uint8Array | number[]): void;
}
