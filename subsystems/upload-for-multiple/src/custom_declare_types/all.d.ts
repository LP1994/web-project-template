/// <reference types="./vite/client.d.ts" />
/// <reference types="./define.d.ts" />
/// <reference types="./img.d.ts" />
/// <reference types="./music.d.ts" />
/// <reference types="./provide.d.ts" />
/// <reference types="./videos.d.ts" />
/// <reference types="./vue.d.ts" />

/**
 * Project: upload-for-multiple
 * FileDirPath: src/custom_declare_types/all.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2024-1-1 00:00:00 星期一
 */

/**
 * 自定义的TS类型描述。
 */

// CSS modules
type T_CSSModuleClasses = {
  readonly [ key: string ]: string;
};

interface I_WASMObject {
  readonly [ key: string ]: any;
}

interface I_Object001 {
  readonly [ key: string ]: any;
}

declare module '*.module.postcss' {
  const classes: T_CSSModuleClasses;

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
  const module: I_Object001;

  export default module;
}

declare module '*.csv' {
  const module: I_Object001;

  export default module;
}

declare module '*.tsv' {
  const module: I_Object001;

  export default module;
}

declare module '*.ejs' {
  import {
    type TemplateFunction as T_TemplateFunction,
  } from '@types/ejs';

  const module: T_TemplateFunction;

  export default module;
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
    type DocumentNode as T_DocumentNode,
  } from 'graphql';

  const module: T_DocumentNode;

  export default module;
}

declare module '*.graphqls' {
  import {
    type DocumentNode as T_DocumentNode,
  } from 'graphql';

  const module: T_DocumentNode;

  export default module;
}

declare module '*.gql' {
  import {
    type DocumentNode as T_DocumentNode,
  } from 'graphql';

  const module: T_DocumentNode;

  export default module;
}

declare module '*.handlebars' {
  const module: ( data: I_Object001 ) => string;

  export default module;
}

declare module '*.hbs' {
  const module: ( data: I_Object001 ) => string;

  export default module;
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
  const module: I_Object001;

  export default module;
}

declare module '*.toml' {
  const module: I_Object001;

  export default module;
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
  const module: ( data: I_Object001 ) => string;

  export default module;
}

declare module '*.pug' {
  const module: ( data: I_Object001 ) => string;

  export default module;
}

declare module '*.jade' {
  const module: ( data: I_Object001 ) => string;

  export default module;
}

declare module '*.wasm' {
  const module: I_WASMObject;

  export default module;
}

declare module '*.xml' {
  const module: I_Object001;

  export default module;
}

declare module '*.yaml' {
  const module: I_Object001;

  export default module;
}

declare module '*.yml' {
  const module: I_Object001;

  export default module;
}

declare module '*?worker' {
  interface I_Options {
    type?: 'classic' | 'module';

    credentials?: 'omit' | 'same-origin' | 'include';

    name?: string;
  }

  const workerConstructor: {
    new( options?: I_Options ): Worker
  };

  export default workerConstructor;
}

declare module '*?worker&inline' {
  interface I_Options {
    type?: 'classic' | 'module';

    credentials?: 'omit' | 'same-origin' | 'include';

    name?: string;
  }

  const workerConstructor: {
    new( options?: I_Options ): Worker
  };

  export default workerConstructor;
}

declare module '*?sharedworker' {
  interface I_Options {
    type?: 'classic' | 'module';

    credentials?: 'omit' | 'same-origin' | 'include';

    name?: string;
  }

  const sharedWorkerConstructor: {
    new( options?: I_Options | string ): SharedWorker
  };

  export default sharedWorkerConstructor;
}

declare module '*?sharedworker&inline' {
  interface I_Options {
    type?: 'classic' | 'module';

    credentials?: 'omit' | 'same-origin' | 'include';

    name?: string;
  }

  const sharedWorkerConstructor: {
    new( options?: I_Options | string ): SharedWorker
  };

  export default sharedWorkerConstructor;
}
