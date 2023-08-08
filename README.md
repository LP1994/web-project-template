This is a WEB project template.<br /><br />

介绍：<br />
1、这是一个可以“即开即用”基于webpack 5的WEB前端项目开发模板，目前对于“微前端架构”的支持正在测试中，使用webpack 5的Module Federation构建“微前端架构”。<br />
2、用于WEB前端项目的快速搭建、开发、编译、打包等WEB前端项目流程操作。<br />
3、内置了大多数WEB前端项目都会有的各种配置。<br />
4、内置支持Vue（默认使用的是Vue 3版本）、TypeScript，也允许自定义扩展成自己想要的WEB项目开发环境（如扩展成：React、Angular等等）。<br />
5、“src/tools”文件夹下有几个个人总结的JS工具类及其详细的文档。<br />
6、“subsystems”文件夹下都是“微前端架构”中各个“子系统”工程的文件夹，使用webpack 5的Module Federation构建“微前端架构”。<br />
7、“element-ui”有2.0的也有3.0（element-plus）的，默认使用3.0的element-plus。<br />
8、“simulation_servers/deno”下有基于HTTP/2实现的服务端（提供https://、wss://服务），本人亲自对比过，HTTP/2确实在并发方面强于HTTP1.1，强的不是一星半点，对比见“simulation_servers/deno/notes/关于HTTP2跟HTTP1_1的直观对比”文件夹下的4张图片。<br />
9、在“webpack.base.esm.mjs”中对“webpack-dev-server”开发服务器是启用“HTTP/1.1”的。<br />
PS：当前发现一个小问题！使用“HTTP/2”时，在自动更新代码并自动刷新浏览器页面的时候，会出现某些文件的请求错误：<br />
GET https://localhost:8100/dev_server/js/VendorsJS_Bundle_b722f600ea72cf9a.js net::ERR_HTTP2_PROTOCOL_ERROR 200
只能再次手动“清空缓存并硬性重新加载”页面才能正常加载资源。所以，还是用回“HTTP/1.1”。<br />
10、在“simulation_servers/deno/src/database/mongo/test”中有“npm包的mongoose”、“npm包的mongodb”的配置参考，编写了这两者的“deno”、“node”版本，都测试通过了，可用，但是有些许差异。<br />



基于webpack的使用Worker的说明和注意事项。
1、要想让webpack处理Worker文件中的各种文件的导入处理、第3方库的导入处理、ts代码的编译等等，就要使用并且也只能使用这个写法来创建Worker：
new Worker( new URL( './test.worker.ts', import.meta.url ) )
2、且不可以使用变量、常量来设置Worker构造函数的第1个参数，即这种写法也是不行的：
const url = new URL( './test.worker.ts', import.meta.url );
new Worker( url )
