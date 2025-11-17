/**
 * Project: web-project-template
 * FileDirPath: src/custom_declare_types/virtual_module.d.ts
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2025-11-15 00:00:00 星期六
 */

/**
 * 配合虚拟模块使用的声明。可自行进一步根据具体需要，写更加详细的类型声明。
 */

declare module 'virtual:*' {
  const mod: any;

  export default mod;
}

declare module 'v:*' {
  const mod: any;

  export default mod;
}
