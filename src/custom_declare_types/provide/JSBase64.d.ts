/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.7';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = '3.7.7';
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill: ( bin: string ) => string;
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa: ( bin: string ) => string;
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array: ( u8a: Uint8Array, urlsafe?: boolean ) => string;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob: ( u: string ) => string;
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode: ( src: string, urlsafe?: boolean ) => string;
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI: ( src: string ) => string;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou: ( b: string ) => string;
/**
 * polyfill version of `atob`
 */
const atobPolyfill: ( asc: string ) => string;
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob: ( asc: string ) => string;
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array: ( a: string ) => Uint8Array;
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode: ( src: string ) => string;
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
 */
const isValid: ( src: any ) => boolean;
/**
 * extend String.prototype with relevant methods
 */
const extendString: () => void;
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array: () => void;
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins: () => void;
const gBase64: {
  version: string;
  VERSION: string;
  atob: ( asc: string ) => string;
  atobPolyfill: ( asc: string ) => string;
  btoa: ( bin: string ) => string;
  btoaPolyfill: ( bin: string ) => string;
  fromBase64: ( src: string ) => string;
  toBase64: ( src: string, urlsafe?: boolean ) => string;
  encode: ( src: string, urlsafe?: boolean ) => string;
  encodeURI: ( src: string ) => string;
  encodeURL: ( src: string ) => string;
  utob: ( u: string ) => string;
  btou: ( b: string ) => string;
  decode: ( src: string ) => string;
  isValid: ( src: any ) => boolean;
  fromUint8Array: ( u8a: Uint8Array, urlsafe?: boolean ) => string;
  toUint8Array: ( a: string ) => Uint8Array;
  extendString: () => void;
  extendUint8Array: () => void;
  extendBuiltins: () => void;
};

/**
 * 又一个 Base64 转码器。<br />
 * 详细见：https://github.com/dankogai/js-base64
 */
declare const JSBase64: {
  version: typeof version;
  VERSION: typeof VERSION;
  atob: typeof _atob;
  atobPolyfill: typeof atobPolyfill;
  btoa: typeof _btoa;
  btoaPolyfill: typeof btoaPolyfill;
  fromBase64: typeof decode;
  toBase64: typeof encode;
  utob: typeof utob;
  encode: typeof encode;
  encodeURI: typeof encodeURI;
  encodeURL: typeof encodeURI;
  btou: typeof btou;
  decode: typeof decode;
  isValid: typeof isValid;
  fromUint8Array: typeof fromUint8Array;
  toUint8Array: typeof toUint8Array;
  extendString: typeof extendString;
  extendUint8Array: typeof extendUint8Array;
  extendBuiltins: typeof extendBuiltins;
  Base64: typeof gBase64;
};
