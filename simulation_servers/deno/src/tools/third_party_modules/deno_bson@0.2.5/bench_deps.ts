// @ts-ignore
import * as stable from 'https://deno.land/x/web_bson/mod.ts';

// @ts-ignore
import * as jsBson from 'https://cdn.skypack.dev/bson';

// @ts-ignore
import * as local from './mod.ts';

export type BsonModule = typeof stable | typeof jsBson | typeof local;

export {
  jsBson,
  local,
  stable
};
