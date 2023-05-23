/// <reference types="vite/client" />
/// <reference types="./define.d.ts" />
/// <reference types="./vue.d.ts" />

/**
 * Project: web-project-template
 * FileDirPath: src/custom_declare_types/all.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

/**
 * 自定义的TS类型描述。
 */

// CSS modules
type CSSModuleClasses = {
  readonly [ key: string ]: string;
};

interface ArrayConstructor {
  fromAsync( asyncItems: AsyncIterable | Iterable | ArrayLike ): Promise<[]>;

  fromAsync( asyncItems: AsyncIterable | Iterable | ArrayLike, mapfn?: ( v: any, k: number ) => any ): Promise<[]>;

  fromAsync( asyncItems: AsyncIterable | Iterable | ArrayLike, mapfn?: ( v: any, k: number ) => any, thisArg?: any ): Promise<[]>;
}

declare module '*.module.postcss' {
  const classes: CSSModuleClasses;

  export default classes;
}
