/* @ts-self-types="./FileHashWasmByRust.d.ts" */

/**
 * 文件哈希计算器。
 *
 * 算法选择和 Hex / Base64 输出格式均由 JavaScript 构造参数决定。
 *
 * 注意：sha1 / sha-1、sha256 / sha-256 / sha2-256 等是别名，
 * 每组别名在 Rust 内部只对应一个哈希计算状态，不会重复计算。
 */
export class FileHasher {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FileHasherFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_filehasher_free(ptr, 0);
    }
    /**
     * 获取已经处理的总字节数；JavaScript 中对应 BigInt。
     * @returns {bigint}
     */
    bytesProcessed() {
        const ret = wasm.filehasher_bytesProcessed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * 将当前哈希结果写入 JavaScript 传入的对象，并返回同一对象。
     *
     * 如果目标对象缺少选中算法的子对象或编码属性，会自动创建。
     * 只写入构造时所选的别名和编码格式。
     * @param {any} result
     * @returns {any}
     */
    digestInto(result) {
        const ret = wasm.filehasher_digestInto(this.__wbg_ptr, result);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * 获取当前已输入数据的哈希结果。
     *
     * 只返回构造时选择的算法别名及其编码格式。
     * 通过 clone() 计算快照，不会消耗原始哈希状态。
     * @returns {any}
     */
    digest() {
        const ret = wasm.filehasher_digest(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
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
     * @param {any} options
     */
    constructor(options) {
        const ret = wasm.filehasher_new(options);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0];
        FileHasherFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 重置所有已启用算法的状态，但保留算法别名及编码格式选择。
     */
    reset() {
        wasm.filehasher_reset(this.__wbg_ptr);
    }
    /**
     * 向所有已启用的唯一哈希算法输入一块文件数据。
     *
     * chunk: &[u8] 对应 JavaScript 的 Uint8Array。
     *
     * 不同别名不会导致重复更新：例如 sha256 和 sha2-256
     * 在内部共用同一个 Sha256 状态。
     * @param {Uint8Array | number[]} chunk
     */
    update(chunk) {
        const ptr0 = passArray8ToWasm0(chunk, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.filehasher_update(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}
if (Symbol.dispose) FileHasher.prototype[Symbol.dispose] = FileHasher.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_is_null_c22311b1cc228e3a: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_null_or_undefined_fb96af93c75460ae: function(arg0) {
            const ret = arg0 == null;
            return ret;
        },
        __wbg___wbindgen_is_object_8b968c3ab8e96595: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_throw_4c88d8bf264fd984: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_get_2080c49015e35254: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_hasOwn_19cf56c2a374e9e5: function(arg0, arg1) {
            const ret = Object.hasOwn(arg0, arg1);
            return ret;
        },
        __wbg_new_cd4348290afae586: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_set_2793479888329cb6: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            table.set(0, undefined);
            table.set(1024, undefined);
            table.set(1025, null);
            table.set(1026, true);
            table.set(1027, false);
        },
    };
    return {
        __proto__: null,
        "./FileHashWasmByRust_bg.js": import0,
    };
}

const FileHasherFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_filehasher_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
cachedTextDecoder.decode();
function decodeText(bytes) {
    return cachedTextDecoder.decode(bytes);
}

let WASM_VECTOR_LEN = 0;

const wasmUrl = new URL('FileHashWasmByRust_bg.wasm', import.meta.url);
const wasmInstantiated = await WebAssembly.instantiateStreaming(fetch(wasmUrl), __wbg_get_imports());
const wasmInstance = wasmInstantiated.instance;
const wasm = wasmInstance.exports;
wasm.__wbindgen_start();
