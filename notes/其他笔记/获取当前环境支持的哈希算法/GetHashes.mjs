// deno run ./GetHashes.mjs
// node ./GetHashes.mjs

// 当前运行环境支持的 OpenSSL 摘要算法可以通过 getHashes() 查询。
// 特别注意：getHashes() 返回的是当前 Deno/Node 运行环境实际提供的算法列表，而不是一份固定的算法清单。不同 Deno/Node 版本、运行环境和底层加密库配置可能导致结果有所不同。
import { getHashes } from "node:crypto";

console.log("当前支持的哈希算法：");

for (const algorithm of getHashes()) {
  console.log(algorithm);
}
