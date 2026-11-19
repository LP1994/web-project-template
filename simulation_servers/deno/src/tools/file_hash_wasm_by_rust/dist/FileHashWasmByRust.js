/* @ts-self-types="./FileHashWasmByRust.d.ts" */

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
     * 获取已经处理的字节数。
     *
     * Rust u64 在 JavaScript 中对应 BigInt。
     *
     * JavaScript:
     *
     * const size = hasher.bytesProcessed();
     * @returns {bigint}
     */
    bytesProcessed() {
        const ret = wasm.filehasher_bytesProcessed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * 将计算得到的哈希值写入 JavaScript 传入的对象。
     *
     * JavaScript:
     *
     * const result = hasher.digestInto(hashResult);
     *
     * 返回的就是原来的 hashResult 对象。
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
     * 获取当前已经计算的数据所对应的所有哈希值。
     *
     * 此方法不会清空或消耗原来的哈希计算器。
     *
     * JavaScript:
     *
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
     * 创建一个新的 FileHasher 实例。
     *
     * JavaScript:
     *
     * const hasher = new FileHasher();
     */
    constructor() {
        const ret = wasm.filehasher_new();
        this.__wbg_ptr = ret;
        FileHasherFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 重置四种哈希计算器。
     *
     * 调用之后，FileHasher 可以重新计算另一个文件。
     *
     * JavaScript:
     *
     * hasher.reset();
     */
    reset() {
        wasm.filehasher_reset(this.__wbg_ptr);
    }
    /**
     * 向四种哈希计算器输入一块文件数据。
     *
     * chunk 对应 JavaScript 中的 Uint8Array。
     *
     * JavaScript:
     *
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
