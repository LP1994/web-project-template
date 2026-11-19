/* tslint:disable */
/* eslint-disable */

/**
 * 文件哈希计算器。
 *
 * 一个 FileHasher 实例同时维护四种哈希算法的内部状态：
 *
 * 1. MD5
 * 2. SHA-256
 * 3. SHA-384
 * 4. SHA-512
 *
 * 每次调用 update() 时，四种算法都会接收相同的文件数据。
 *
 * 因此，最终只需要遍历一次文件，就可以得到四种哈希结果。
 */
export class FileHasher {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 获取已经处理的字节数。
     *
     * Rust u64 在 JavaScript 中对应 BigInt。
     *
     * JavaScript:
     *
     * const size = hasher.bytesProcessed();
     */
    bytesProcessed(): bigint;
    /**
     * 将计算得到的哈希值写入 JavaScript 传入的对象。
     *
     * JavaScript:
     *
     * const result = hasher.digestInto(hashResult);
     *
     * 返回的就是原来的 hashResult 对象。
     */
    digestInto(result: any): any;
    /**
     * 获取当前已经计算的数据所对应的所有哈希值。
     *
     * 此方法不会清空或消耗原来的哈希计算器。
     *
     * JavaScript:
     *
     * const result = hasher.digest();
     */
    digest(): any;
    /**
     * 创建一个新的 FileHasher 实例。
     *
     * JavaScript:
     *
     * const hasher = new FileHasher();
     */
    constructor();
    /**
     * 重置四种哈希计算器。
     *
     * 调用之后，FileHasher 可以重新计算另一个文件。
     *
     * JavaScript:
     *
     * hasher.reset();
     */
    reset(): void;
    /**
     * 向四种哈希计算器输入一块文件数据。
     *
     * chunk 对应 JavaScript 中的 Uint8Array。
     *
     * JavaScript:
     *
     * hasher.update(chunk);
     */
    update(chunk: Uint8Array | number[]): void;
}
