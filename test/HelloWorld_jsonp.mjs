/**
 * Project: web-project-template
 * FileDirPath: src/pages/hello_world/HelloWorld.mjs
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
