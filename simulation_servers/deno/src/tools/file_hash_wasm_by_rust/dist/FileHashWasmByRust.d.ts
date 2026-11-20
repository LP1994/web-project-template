/* tslint:disable */
/* eslint-disable */

/**
 * 文件哈希计算器。
 *
 * 算法选择和 Hex / Base64 输出格式均由 JavaScript 构造参数决定。
 *
 * 注意：sha1 / sha-1、sha256 / sha-256 / sha2-256 等是别名，
 * 每组别名在 Rust 内部只对应一个哈希计算状态，不会重复计算。
 */
export class FileHasher {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 获取已经处理的总字节数；JavaScript 中对应 BigInt。
     */
    bytesProcessed(): bigint;
    /**
     * 将当前哈希结果写入 JavaScript 传入的对象，并返回同一对象。
     *
     * 如果目标对象缺少选中算法的子对象或编码属性，会自动创建。
     * 只写入构造时所选的别名和编码格式。
     */
    digestInto(result: any): any;
    /**
     * 获取当前已输入数据的哈希结果。
     *
     * 只返回构造时选择的算法别名及其编码格式。
     * 通过 clone() 计算快照，不会消耗原始哈希状态。
     */
    digest(): any;
    /**
     * 根据 JavaScript 对象创建哈希计算器。
     *
     * 支持的配置键：
     *
     * SHA-1：哈希算法第1代
     *   sha1、sha-1
     *
     * SHA-224：哈希算法第2代
     *   sha224、sha-224、sha2-224
     *
     * SHA-256：哈希算法第2代
     *   sha256、sha-256、sha2-256
     *
     * SHA-384：哈希算法第2代
     *   sha384、sha-384、sha2-384
     *
     * SHA-512：哈希算法第2代
     *   sha512、sha-512、sha2-512
     *
     * SHA-3：哈希算法第3代
     *   sha3-224、sha3-256、sha3-384、sha3-512
     *
     * 每个算法配置对象中可以独立提供 hex 和 / 或 base64 属性。
     * 属性是否存在决定是否选择该输出格式，属性值本身不参与判断。
     *
     * 示例：
     * const options = {
     *     md5: { hex: "" },
     *     "sha-1": { hex: "" },
     *     "sha2-224": { base64: "" },
     *     "sha256": { hex: "", base64: "" },
     *     "sha3-512": { hex: "" },
     * };
     * const hasher = new FileHasher(options);
     *
     * 同一种算法的多个别名可以同时出现。此时只计算一次，
     * 并将同一摘要按各自配置写入相应的别名键。
     */
    constructor(options: any);
    /**
     * 重置所有已启用算法的状态，但保留算法别名及编码格式选择。
     */
    reset(): void;
    /**
     * 向所有已启用的唯一哈希算法输入一块文件数据。
     *
     * chunk: &[u8] 对应 JavaScript 的 Uint8Array。
     *
     * 不同别名不会导致重复更新：例如 sha256 和 sha2-256
     * 在内部共用同一个 Sha256 状态。
     */
    update(chunk: Uint8Array | number[]): void;
}
