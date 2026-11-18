/* @ts-self-types="./rust_wasm_bindgen_wasm_pack_demo.d.ts" */
import * as wasm from "./rust_wasm_bindgen_wasm_pack_demo_bg.wasm";
import { __wbg_set_wasm } from "./rust_wasm_bindgen_wasm_pack_demo_bg.js";

__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    Counter, add, base64_decode_bytes, base64_decode_text, base64_encode_bytes, base64_encode_text, calculate_async, divide, greet, json_parse, json_stringify, multiply, normalize_user, on_start, scale_values
} from "./rust_wasm_bindgen_wasm_pack_demo_bg.js";
