#!/usr/bin/env -S node --experimental-import-meta-resolve --experimental-network-imports --experimental-shadow-realm --experimental-vm-modules --experimental-wasm-modules --experimental-websocket --max-http-header-size=1024000 --no-warnings --no-deprecation

/**
 * Project: web-project-template
 * FileDirPath: src/pages/index/Index.mjs
 * Author: 12278
 * Email: 1227839175@qq.com
 * IDE: WebStorm
 * CreateDate: 2022-01-01 00:00:00 星期六
 */

'use strict';

document.querySelector( 'main' ).textContent = `Hello World!`;

$( () => {
  const callBack = 'JSONPCallBack';

  $( 'body' ).append( `<script>
  window[ '${ callBack }' ] = ( ...args ) => {
    console.dir( args );
  };
</script>` );

  document.querySelector( 'main' ).addEventListener( 'click', event => {
    $( 'body' )
      .append( `<script src = '${ location.protocol }//${ location.hostname }:9200/simulation_servers_deno/jsonp?callBack=${ callBack }&name=林沐风&age=12#personal_information'></script>` );
  } );

} );
