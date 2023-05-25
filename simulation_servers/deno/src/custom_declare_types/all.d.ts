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

declare module 'npm:mongodb' {
  export * from 'mongodb';
}

declare module 'npm:mongoose' {
  export * from 'mongoose';
}
