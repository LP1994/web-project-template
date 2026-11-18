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
