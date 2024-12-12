This is a remote Vue component built on Module Federation 2.<br />

<br />

介绍：<br />
1、这是一个基于“Module Federation 2”构建的远端Vue组件。其前端基建配置衍生于“web-project-template”，故具体介绍可见于“web-project-template”中的介绍。<br />
2、内置支持Vue（默认使用的是Vue 3版本）、TypeScript，也允许自定义扩展成自己想要的WEB项目开发环境（如扩展成：React、Angular等等）。<br />
3、“element-ui”有2.0的也有3.0（element-plus）的，默认使用3.0的element-plus。<br />
4、在“webpack.base.esm.mjs”中对“webpack-dev-server”开发服务器是启用“HTTP/1.1”的。<br />
PS：当前发现一个小问题！使用“HTTP/2”时，在自动更新代码并自动刷新浏览器页面的时候，会出现某些文件的请求错误：<br />
GET https://localhost:8100/dev_server/js/VendorsJS_Bundle_b722f600ea72cf9a.js net::ERR_HTTP2_PROTOCOL_ERROR 200<br />
只能再次手动“清空缓存并硬性重新加载”页面才能正常加载资源。所以，还是用回“HTTP/1.1”。<br />

<br />

基于webpack的使用Worker的说明和注意事项。<br />
1、要想让webpack处理Worker文件中的各种文件的导入处理、第3方库的导入处理、ts代码的编译等等，就要使用并且也只能使用这个写法来创建Worker：<br />
<code>
new Worker( new URL( './test.worker.ts', import.meta.url ) );
</code>
<br />
2、且不可以使用变量、常量来设置Worker构造函数的第1个参数，即这种写法也是不行的：<br />
<code>
const url = new URL( './test.worker.ts', import.meta.url );
new Worker( url );
</code>
