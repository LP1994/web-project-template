export class Counter {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CounterFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_counter_free(ptr, 0);
    }
    decrement() {
        const ret = wasm.counter_decrement(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    get_value() {
        const ret = wasm.counter_get_value(this.__wbg_ptr);
        return ret;
    }
    increment() {
        const ret = wasm.counter_increment(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {number} initial_value
     */
    constructor(initial_value) {
        const ret = wasm.counter_new(initial_value);
        this.__wbg_ptr = ret;
        CounterFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) Counter.prototype[Symbol.dispose] = Counter.prototype.free;

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a, b) {
    const ret = wasm.add(a, b);
    return ret;
}

/**
 * @param {string} encoded
 * @returns {Uint8Array}
 */
export function base64_decode_bytes(encoded) {
    const ptr0 = passStringToWasm0(encoded, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.base64_decode_bytes(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * @param {string} encoded
 * @returns {string}
 */
export function base64_decode_text(encoded) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(encoded, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.base64_decode_text(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {Uint8Array | number[]} input
 * @returns {string}
 */
export function base64_encode_bytes(input) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.base64_encode_bytes(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} input
 * @returns {string}
 */
export function base64_encode_text(input) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.base64_encode_text(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {Promise<number>}
 */
export function calculate_async(a, b) {
    const ret = wasm.calculate_async(a, b);
    return ret;
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function divide(a, b) {
    const ret = wasm.divide(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {string} name
 * @returns {string}
 */
export function greet(name) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.greet(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} text
 * @returns {any}
 */
export function json_parse(text) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.json_parse(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} value
 * @returns {string}
 */
export function json_stringify(value) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.json_stringify(value);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function multiply(a, b) {
    const ret = wasm.multiply(a, b);
    return ret;
}

/**
 * @param {any} value
 * @returns {any}
 */
export function normalize_user(value) {
    const ret = wasm.normalize_user(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

export function on_start() {
    wasm.on_start();
}

/**
 * @param {Float64Array | number[]} values
 * @param {number} factor
 * @returns {Float64Array}
 */
export function scale_values(values, factor) {
    const val2 = +factor;
    const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.scale_values(ptr0, len0, val2);
    var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v3;
}
export function __wbg_Error_208446807d0d1e30(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_String_8564e559799eccda(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_boolean_get_4f1baf9a00be3c74(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}
export function __wbg___wbindgen_debug_string_f249a2a76caa9a55(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_in_3f58a9d3b3a7eed2(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
}
export function __wbg___wbindgen_is_function_741ff2bb612836f5(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
}
export function __wbg___wbindgen_is_object_8b968c3ab8e96595(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
}
export function __wbg___wbindgen_is_undefined_be5b34249ff1fc15(arg0) {
    const ret = arg0 === undefined;
    return ret;
}
export function __wbg___wbindgen_jsval_loose_eq_b2f214e2e4b30e36(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
}
export function __wbg___wbindgen_number_get_934b640d0889af78(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64((arg0 >>> 0) + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_string_get_7ce8eee7fd327545(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_throw_4c88d8bf264fd984(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbg__wbg_cb_unref_09736879a3f67559(arg0) {
    arg0._wbg_cb_unref();
}
export function __wbg_atob_d92cafbee32add8e() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.atob(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
}, arguments); }
export function __wbg_btoa_7200f406429c42ad() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.btoa(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
}, arguments); }
export function __wbg_call_40b008ba32f73991() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments); }
export function __wbg_call_a410eb4b59ed5965() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments); }
export function __wbg_clearTimeout_122249a6036df0eb(arg0) {
    const ret = clearTimeout(arg0);
    return ret;
}
export function __wbg_done_57e08d0be6e30c02(arg0) {
    const ret = arg0.done;
    return ret;
}
export function __wbg_error_757e9472f8410341(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
}
export function __wbg_get_635eea311fa1a291() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_get_unchecked_e6325ad374eff861(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
}
export function __wbg_get_with_ref_key_fc601247060b7204(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
}
export function __wbg_instanceof_ArrayBuffer_12cdaa4161423e6b(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Uint8Array_d7aeb0dcb3108fea(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Window_5cf453f5639aa1a2(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_isArray_bcf1376d0d732d08(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
}
export function __wbg_iterator_e4c5e8f68ada7b58() {
    const ret = Symbol.iterator;
    return ret;
}
export function __wbg_length_186163212ffe79c3(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_length_b03a0fabb109b1e9(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_new_13de428334042d26(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
}
export function __wbg_new_37eb45aaf5eeb820() {
    const ret = new Array();
    return ret;
}
export function __wbg_new_bb74001155cb8ca8() {
    const ret = new Error();
    return ret;
}
export function __wbg_new_cd4348290afae586() {
    const ret = new Object();
    return ret;
}
export function __wbg_new_typed_e09da9dae6ee5935(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke___js_sys_833d9eff1dda539d___Function_fn_wasm_bindgen_11c7a3b4a81d6cb0___JsValue_____wasm_bindgen_11c7a3b4a81d6cb0___sys__Undefined___js_sys_833d9eff1dda539d___Function_fn_wasm_bindgen_11c7a3b4a81d6cb0___JsValue_____wasm_bindgen_11c7a3b4a81d6cb0___sys__Undefined_______true_(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = 0;
    }
}
export function __wbg_next_178c1651c11432b3(arg0) {
    const ret = arg0.next;
    return ret;
}
export function __wbg_next_af5ac6a08bb0a717() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments); }
export function __wbg_parse_c3f72b5a24f83c01() { return handleError(function (arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments); }
export function __wbg_prototypesetcall_13162965d1fe7aa3(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
}
export function __wbg_queueMicrotask_1e8503a8a690f0a3(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
}
export function __wbg_queueMicrotask_4a1a4d8dd332373b(arg0) {
    queueMicrotask(arg0);
}
export function __wbg_resolve_dbf78ab4942478b0(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
}
export function __wbg_setTimeout_98d9e1ec0fa68b48() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_set_d2d33b52458e984a(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
}
export function __wbg_set_e4b9a833d288759a(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
}
export function __wbg_stack_575c4e0918581b9c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
    getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
}
export function __wbg_static_accessor_GLOBAL_THIS_003ee833af9699fc() {
    const ret = typeof globalThis === 'undefined' ? undefined : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_GLOBAL_e4293fb22cbe77da() {
    const ret = typeof global === 'undefined' ? undefined : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_SELF_53bb20457401453d() {
    const ret = typeof self === 'undefined' ? undefined : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_WINDOW_b5e0810bfecb7feb() {
    const ret = typeof window === 'undefined' ? undefined : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_stringify_0a0fbf2ef722380a() { return handleError(function (arg0) {
    const ret = JSON.stringify(arg0);
    return ret;
}, arguments); }
export function __wbg_then_e3f7f2d365708be8(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
}
export function __wbg_value_e0f328965e184931(arg0) {
    const ret = arg0.value;
    return ret;
}
export function __wbindgen_generic_0000000000000001(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 35, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke___wasm_bindgen_11c7a3b4a81d6cb0___JsValue__core_d941ad8722425d2e___result__Result_____wasm_bindgen_11c7a3b4a81d6cb0___JsError___true_);
    return ret;
}
export function __wbindgen_generic_0000000000000002(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 26, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke_______true_);
    return ret;
}
export function __wbindgen_generic_0000000000000003(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
}
export function __wbindgen_generic_0000000000000004(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
}
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    table.set(0, undefined);
    table.set(1024, undefined);
    table.set(1025, null);
    table.set(1026, true);
    table.set(1027, false);
}
function wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke_______true_(arg0, arg1) {
    wasm.wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke_______true_(arg0, arg1);
}

function wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke___wasm_bindgen_11c7a3b4a81d6cb0___JsValue__core_d941ad8722425d2e___result__Result_____wasm_bindgen_11c7a3b4a81d6cb0___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke___wasm_bindgen_11c7a3b4a81d6cb0___JsValue__core_d941ad8722425d2e___result__Result_____wasm_bindgen_11c7a3b4a81d6cb0___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke___js_sys_833d9eff1dda539d___Function_fn_wasm_bindgen_11c7a3b4a81d6cb0___JsValue_____wasm_bindgen_11c7a3b4a81d6cb0___sys__Undefined___js_sys_833d9eff1dda539d___Function_fn_wasm_bindgen_11c7a3b4a81d6cb0___JsValue_____wasm_bindgen_11c7a3b4a81d6cb0___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_11c7a3b4a81d6cb0___convert__closures_____invoke___js_sys_833d9eff1dda539d___Function_fn_wasm_bindgen_11c7a3b4a81d6cb0___JsValue_____wasm_bindgen_11c7a3b4a81d6cb0___sys__Undefined___js_sys_833d9eff1dda539d___Function_fn_wasm_bindgen_11c7a3b4a81d6cb0___JsValue_____wasm_bindgen_11c7a3b4a81d6cb0___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}

const CounterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_counter_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    switch (typeof val) {
        // primitive types
        case 'number':
        case 'boolean':
        case 'undefined':
        return `${val}`;
        case 'string':
        return JSON.stringify(val);
        case 'bigint':
        return `${val}n`;
        case 'symbol':
        return val.description !== undefined
            ? `Symbol(${val.description})`
            : 'Symbol';
        case 'function':
        return typeof val.name === 'string' && val.name !== ''
            ? `Function(${val.name})`
            : 'Function';
        case 'object': {
            if (val === null) {
                return 'null';
            }
            // objects
            if (Array.isArray(val)) {
                return '[' + Array.from(val, debugString).join(', ') + ']';
            }
            // errors
            if (val instanceof Error) {
                return `${val.name}: ${val.message}\n${val.stack}`;
            }

            const toStringOutput = toString.call(val);
            // Test for built-in
            const className = /\[object ([^\]]+)\]/.exec(toStringOutput)?.[1];

            // Failed to match the standard '[object ClassName]'
            if (className === undefined) {
                return toStringOutput;
            }
            if (className === 'Object') {
                // we're a user defined class or Object
                // JSON.stringify avoids problems with cycles, and is generally much
                // easier than looping through ownProperties of `val`.
                try {
                    return 'Object(' + JSON.stringify(val) + ')';
                } catch (_) {
                    return 'Object';
                }
            }
            // TODO we could test for more things here, like `Set`s and `Map`s.
            return className;
        }
        // Per MDN: 'This list of values is exhaustive.'
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#description
    }
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
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

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(bytes) {
    numBytesDecoded += bytes.length;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
        cachedTextDecoder.decode();
        numBytesDecoded = bytes.length;
    }
    return cachedTextDecoder.decode(bytes);
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
