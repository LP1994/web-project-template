/* @ts-self-types="./FileHashWasmByRust.d.ts" */

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
     * 获取已经处理的总字节数。Rust u64 在 JavaScript 中映射为 BigInt。
     * @returns {bigint}
     */
    bytesProcessed() {
        const ret = wasm.filehasher_bytesProcessed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * 将当前已输入数据的哈希结果写入 JavaScript 传入对象。
     *
     * 只写入构造时选中的算法及编码格式。
     * 如果目标对象缺少对应算法子对象或输出属性，会自动创建。
     * 未选择的编码属性不会被生成或覆盖。
     *
     * JavaScript：
     * const result = hasher.digestInto(resultObject);
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
     * 只返回构造时选中的算法和编码格式。
     * 此方法通过 clone() 复制哈希状态，不会消耗原始状态，
     * 因此调用 digest() 后仍然可以继续 update()。
     *
     * JavaScript：
     * const result = hasher.digest();
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
     * 重置已启用的哈希计算器及累计字节数。算法选择和 Hex / Base64 输出格式选择保持不变。
     */
    reset() {
        wasm.filehasher_reset(this.__wbg_ptr);
    }
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
