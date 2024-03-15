该工具库是使用“TypeScript”编写的公共的、通用的、不特定于某个项目使用的脚本工具库。<br />
该通用工具仅用于Deno环境，并且不是特定于某个项目才能使用的，使用“ECMAScript modules(ECMAScript模块)”写法。<br /><br /><br />



编写原则：<br />
1、能用模块化的API尽量用模块化的，少用或者不用全局的，目的是为了让“编码风格”尽量符合“模块化”的理念。<br />

2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。<br />

3、注意函数尾调用、算法时间复杂度、算法空间复杂度等优化。<br />

4、那些不被导出供外部调用使用的、属于内部7788的处理函数、类等等，要以“HandleBy”打头命名。<br />

5、那些需要被导出供外部调用使用的函数、类等等，一定要记得也要同时部署在“默认导出”中。<br />

6、编程范式使用“函数式编程”，结合“TypeScript”编写，这样更好得便于被Webpack等工具进行“Tree-shaking”，只打包那些被使用的。<br />

7、那些用于限定、描述数据类型的类型声明也要记得导出，以便供外部使用，如：export type T_MyString001 = string。<br /><br /><br />



关于“严格模式”的注意事项：<br />
1、'use strict'严格模式会在函数内部自动深度的传递严格模式的效果。<br />
如：<br />
```ts
function Fun1( x ){
  'use strict';

  function Fun2( y = 1 ){
    console.log( y );

    console.log( this );
  }

  Fun2();
}
```
说明：<br />
Fun1里的'use strict'严格模式的效果会传递到Fun2内部！<br />
但是，Fun1里的'use strict'严格模式却不会作用于Fun2的默认函数参数，但是Fun2里的this还是会为undefined！<br />
所以，Fun1不可以设置默认函数参数，但是Fun2可以设置默认函数参数！<br />

2、只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。<br />

3、webpack编译后的JS代码会去掉多余的'use strict'，只保留编译前每个文件的顶级'use strict'。<br />

4、class内部的方法中存在的'use strict'，在webpack编译后会被删除。<br />

5、严格模式下的this还是可以通过apply、bind、call来设置的，否则还是undefined。<br />
如：<br />
```ts
'use strict';

function Fun1(){
  'use strict';

  console.dir( this );
}

Fun1.call( { a: 1, } ); // 输出：{ a: 1, }，而不是undefined。
```
