/// <reference types="vite/client" />
/// <reference types="./img.d.ts" />
/// <reference types="./music.d.ts" />
/// <reference types="./videos.d.ts" />

/**
 * Project: web-project-template
 * FileDirPath: simulation_servers/deno/src/custom_declare_types/all.d.ts
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

interface WASMObject {
  readonly [ key: string ]: any;
}

declare module 'npm:mongodb' {
  export * from 'mongodb';
}

declare module 'npm:mongoose' {
  export * from 'mongoose';
}

interface ArrayConstructor {
  fromAsync( asyncItems: AsyncIterable | Iterable | ArrayLike ): Promise<[]>;

  fromAsync( asyncItems: AsyncIterable | Iterable | ArrayLike, mapfn?: ( v: any, k: number ) => any ): Promise<[]>;

  fromAsync( asyncItems: AsyncIterable | Iterable | ArrayLike, mapfn?: ( v: any, k: number ) => any, thisArg?: any ): Promise<[]>;
}

declare module '*.module.postcss' {
  const classes: CSSModuleClasses;

  export default classes;
}

declare module '*.postcss' {
  /**
   * @deprecated Use `import style from './style.pcss?inline'` instead.
   */
  const css: string;

  export default css;
}

declare module '*.cson' {
  const src: string;

  export default src;
}

declare module '*.csv' {
  const src: string;

  export default src;
}

declare module '*.tsv' {
  const src: string;

  export default src;
}

declare module '*.ejs' {
  const src: string;

  export default src;
}

declare module '*.eot' {
  const src: string;

  export default src;
}

declare module '*.otf' {
  const src: string;

  export default src;
}

declare module '*.fon' {
  const src: string;

  export default src;
}

declare module '*.font' {
  const src: string;

  export default src;
}

declare module '*.ttf' {
  const src: string;

  export default src;
}

declare module '*.ttc' {
  const src: string;

  export default src;
}

declare module '*.woff' {
  const src: string;

  export default src;
}

declare module '*.woff2' {
  const src: string;

  export default src;
}

declare module '*.graphql' {
  import {
    type DocumentNode,
  } from 'graphql';

  const module: DocumentNode;

  export = module;

  export default module;
}

declare module '*.graphqls' {
  import {
    type DocumentNode,
  } from 'graphql';

  const module: DocumentNode;

  export = module;

  export default module;
}

declare module '*.gql' {
  import {
    type DocumentNode,
  } from 'graphql';

  const module: DocumentNode;

  export = module;

  export default module;
}

declare module '*.handlebars' {
  const src: string;

  export default src;
}

declare module '*.hbs' {
  const src: string;

  export default src;
}

declare module '*.htm' {
  const src: string;

  export default src;
}

declare module '*.html' {
  const src: string;

  export default src;
}

declare module '*.xhtml' {
  const src: string;

  export default src;
}

declare module '*.json5' {
  const src: string;

  export default src;
}

declare module '*.toml' {
  const src: string;

  export default src;
}

declare module '*.txt' {
  const src: string;

  export default src;
}

declare module '*.manifest.json' {
  const src: string;

  export default src;
}

declare module '*.webmanifest' {
  const src: string;

  export default src;
}

declare module '*.markdown' {
  const src: string;

  export default src;
}

declare module '*.md' {
  const src: string;

  export default src;
}

declare module '*.mustache' {
  const src: string;

  export default src;
}

declare module '*.pug' {
  const src: string;

  export default src;
}

declare module '*.jade' {
  const src: string;

  export default src;
}

declare module '*.wasm' {
  const module: WASMObject;

  export = module;

  export default module;
}

declare module '*.xml' {
  const src: string;

  export default src;
}

declare module '*.yaml' {
  const src: string;

  export default src;
}

declare module '*.yml' {
  const src: string;

  export default src;
}
