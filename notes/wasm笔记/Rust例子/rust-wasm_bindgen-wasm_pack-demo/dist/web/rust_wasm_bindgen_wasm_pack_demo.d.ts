/* tslint:disable */
/* eslint-disable */

export class Counter {
    free(): void;
    [Symbol.dispose](): void;
    decrement(): void;
    get_value(): number;
    increment(): void;
    constructor(initial_value: number);
}

export function add(a: number, b: number): number;

export function base64_decode_bytes(encoded: string): Uint8Array;

export function base64_decode_text(encoded: string): string;

export function base64_encode_bytes(input: Uint8Array | number[]): string;

export function base64_encode_text(input: string): string;

export function calculate_async(a: number, b: number): Promise<number>;

export function divide(a: number, b: number): number;

export function greet(name: string): string;

export function json_parse(text: string): any;

export function json_stringify(value: any): string;

export function multiply(a: number, b: number): number;

export function normalize_user(value: any): any;

export function on_start(): void;

export function scale_values(values: Float64Array | number[], factor: number): Float64Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_counter_free: (a: number, b: number) => void;
    readonly add: (a: number, b: number) => number;
    readonly base64_decode_bytes: (a: number, b: number) => [number, number, number, number];
    readonly base64_decode_text: (a: number, b: number) => [number, number, number, number];
    readonly base64_encode_bytes: (a: number, b: number) => [number, number, number, number];
    readonly base64_encode_text: (a: number, b: number) => [number, number, number, number];
    readonly calculate_async: (a: number, b: number) => any;
    readonly counter_decrement: (a: number) => [number, number];
    readonly counter_get_value: (a: number) => number;
    readonly counter_increment: (a: number) => [number, number];
    readonly counter_new: (a: number) => number;
    readonly divide: (a: number, b: number) => [number, number, number];
    readonly greet: (a: number, b: number) => [number, number];
    readonly json_parse: (a: number, b: number) => [number, number, number];
    readonly json_stringify: (a: any) => [number, number, number, number];
    readonly multiply: (a: number, b: number) => number;
    readonly normalize_user: (a: any) => [number, number, number];
    readonly on_start: () => void;
    readonly scale_values: (a: number, b: number, c: number) => [number, number];
    readonly wasm_bindgen_38aa1bd1a436e0___convert__closures_____invoke___js_sys_c847c3c380ad1b35___Function_fn_wasm_bindgen_38aa1bd1a436e0___JsValue_____wasm_bindgen_38aa1bd1a436e0___sys__Undefined___js_sys_c847c3c380ad1b35___Function_fn_wasm_bindgen_38aa1bd1a436e0___JsValue_____wasm_bindgen_38aa1bd1a436e0___sys__Undefined_______true_: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen_38aa1bd1a436e0___convert__closures_____invoke___wasm_bindgen_38aa1bd1a436e0___JsValue__core_d941ad8722425d2e___result__Result_____wasm_bindgen_38aa1bd1a436e0___JsError___true_: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen_38aa1bd1a436e0___convert__closures_____invoke_______true_: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
