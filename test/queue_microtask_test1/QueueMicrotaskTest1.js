console.log( 'script start' );

async function a1(){
  console.log( 'a1 start' );

  await a2();

  // 申明了一个隐藏的微任务4 Start

  await a4();

  // 申明了一个隐藏的微任务5 Start

  await a4_1();

  // 申明了一个隐藏的微任务6 Start

  console.log( 'a1 end' );

  // 申明了一个隐藏的微任务6 End

  // 申明了一个隐藏的微任务5 End

  // 申明了一个隐藏的微任务4 End
}

async function a2(){
  console.log( 'a2 start' );

  await a3();

  // 申明了一个隐藏的微任务2 Start

  await a3_1();

  // 申明了一个隐藏的微任务3 Start

  console.log( 'a2 end' );

  // 申明了一个隐藏的微任务3 End

  // 申明了一个隐藏的微任务2 End
}

async function a3(){
  console.log( 'a3' );
}

async function a3_1(){
  console.log( 'a3_1' );
}

async function a4(){
  console.log( 'a4' );
}

async function a4_1(){
  console.log( 'a4_1' );
}

// 宏任务1
setTimeout( () => {
  console.log( 'setTimeout' );
}, 0 );

// 微任务1
Promise.resolve()
.then( () => {
  console.log( 'promise1' );
} );

a1();

let promise2 = new Promise( resolve => {
  resolve( 'promise2.then' );

  console.log( 'promise2' );
} );

// 微任务3
/*
 promise2.then( res => {
 console.log( res );

 // 微任务 5
 Promise.resolve()
 .then( () => {
 console.log( 'promise3' );
 } );
 } );
 */

console.log( 'script end' );
