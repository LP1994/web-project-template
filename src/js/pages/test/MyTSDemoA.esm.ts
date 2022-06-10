'use strict';

function foo( arg: unknown ){
    const argIsString = typeof arg === 'string';
    if( argIsString ){
        console.log( arg.toUpperCase() );
    }
}
