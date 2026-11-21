// deno run -A --config=../../../deno.jsonc --check --v8-flags=--max-old-space-size=1024000 --reload --watch-hmr --env-file=../../../.env.deno ./test.mts --color=16m --my_args="{\"md5\":{\"hex\":\"\",\"base64\":\"\"},\"sha512\":{\"hex\":\"\",\"base64\":\"\"},\"sha3-512\":{\"hex\":\"\",\"base64\":\"\"}}"

'use strict';

type T_HashName = 'md5' |
  'sha1' |
  'sha224' |
  'sha256' |
  'sha384' |
  'sha512' |
  'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512';

type T_EncodeType = {
  hex: string;
  base64: string;
} | {
  hex: string;
} | {
  base64: string;
};

const hashTypes = {
  'md5': 'md5',

  'sha1': 'sha1',
  'sha-1': 'sha1',

  'sha224': 'sha224',
  'sha-224': 'sha224',
  'sha2-224': 'sha224',

  'sha256': 'sha256',
  'sha-256': 'sha256',
  'sha2-256': 'sha256',

  'sha384': 'sha384',
  'sha-384': 'sha384',
  'sha2-384': 'sha384',

  'sha512': 'sha512',
  'sha-512': 'sha512',
  'sha2-512': 'sha512',

  'sha3-224': 'sha3-224',
  'sha3-256': 'sha3-256',
  'sha3-384': 'sha3-384',
  'sha3-512': 'sha3-512',
} as const;

type T_HashTypeKey = keyof typeof hashTypes;

const hashOptions: Record<T_HashTypeKey, T_EncodeType> = {
  'md5': {
    'hex': '',
    'base64': '',
  },

  'sha1': {
    'hex': '',
    'base64': ''
  },
  'sha-1': {
    'hex': '',
    'base64': ''
  },

  'sha224': {
    'hex': '',
    'base64': ''
  },
  'sha-224': {
    'hex': '',
    'base64': ''
  },
  'sha2-224': {
    'hex': '',
    'base64': ''
  },

  'sha256': {
    'hex': '',
    'base64': ''
  },
  'sha-256': {
    'hex': '',
    'base64': ''
  },
  'sha2-256': {
    'hex': '',
    'base64': ''
  },

  'sha384': {
    'hex': '',
    'base64': ''
  },
  'sha-384': {
    'hex': '',
    'base64': ''
  },
  'sha2-384': {
    'hex': '',
    'base64': ''
  },

  'sha512': {
    'hex': '',
    'base64': ''
  },
  'sha-512': {
    'hex': '',
    'base64': ''
  },
  'sha2-512': {
    'hex': '',
    'base64': ''
  },

  'sha3-224': {
    'hex': '',
    'base64': ''
  },
  'sha3-256': {
    'hex': '',
    'base64': ''
  },
  'sha3-384': {
    'hex': '',
    'base64': ''
  },
  'sha3-512': {
    'hex': '',
    'base64': ''
  },
};

function CheckHashTypes( hashOptions: Record<T_HashTypeKey, T_EncodeType> ){
  const hashTypeKeys: Array<T_HashTypeKey> = Object.keys( hashTypes ) as Array<T_HashTypeKey>;

  if( Object.keys( hashOptions ).length === 0 || Object.keys( hashOptions ).some( ( item: string ): boolean => {
    return !hashTypeKeys.includes( item as T_HashTypeKey );
  } ) ){
    throw new Error( `当前只支持如下的哈希算法：${ hashTypeKeys.join( ', ' ) }，注意是大小写敏感的，必须严格匹配支持的哈希算法名！` );
  }
}

CheckHashTypes( hashOptions );

function GetHashGroup( hashOptions: Record<T_HashTypeKey, T_EncodeType> ): Array<Record<T_HashTypeKey, T_EncodeType>>{
  const hashOptionsKeys: Array<[ T_HashTypeKey, T_EncodeType ]> = Object.entries( hashOptions ) as Array<[ T_HashTypeKey, T_EncodeType ]>,
    hashObj: Record<T_HashName, Record<T_HashTypeKey, T_EncodeType>> = {} as Record<T_HashName, Record<T_HashTypeKey, T_EncodeType>>;

  hashOptionsKeys.forEach( ( [ item, value ]: [ T_HashTypeKey, T_EncodeType ] ): void => {
    if( ( hashTypes[ item as T_HashTypeKey ] ) in hashObj ){
      hashObj[ hashTypes[ item as T_HashTypeKey ] ][ item as T_HashTypeKey ] = value as T_EncodeType;
    }
    else{
      hashObj[ hashTypes[ item as T_HashTypeKey ] ] = { [ item ]: value } as Record<T_HashTypeKey, T_EncodeType>;
    }
  } );

  return Object.values( hashObj );
}

console.dir( GetHashGroup( hashOptions ) );
