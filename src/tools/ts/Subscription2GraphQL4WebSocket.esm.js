/**
 * Project: sn-data-center-platform-micro-front-web
 * Author：12278
 * Email：1227839175@qq.com
 * CreateDate：2020-06-29 18:35:35
 * IDE: WebStorm
 */

// 该JS文件是该项目的一个用于GraphQL订阅功能的基于WebSocket协议进行全双工通信的工具类

'use strict';

let CT = new CTESM.CT();

const {
    WebSocket4Client,
} = CT.getClass();

const url_strC = `://${ CT.getAbs4URL( '/' )
                          .split( '://' )[ 1 ] }graphql`,
    wsURL_strC = `ws${ url_strC }`,
    wssURL_strC = `wss${ url_strC }`,
    // WebSocket连接初始化，这步操作主要是为了防止连接超时自动断开以及做一些“令牌”验证等正式消息发送前的预操作。
    init_objC = {
        id: undefined,
        type: 'connection_init',
        // payload里头的属性字段名可以是operationName、query、variables以及其他属性字段名
        payload: {},
    },
    start_objC = {
        // id必须是唯一的，字符串
        // id: '0',
        type: 'start',
        // payload里头的属性字段名可以是operationName、query、variables以及其他属性字段名
        // payload: {},
    };

const CONNECTING = '正在连接中!',
    CLOSING = '连接正在关闭中！',
    CLOSED = '连接已关闭或无法打开！';

function GetError1( str ){
    return `当前WebSocket的连接状态码(${ str }):不在0、1、2、3之列！`;
}

function GetError2( str ){
    return `因为该WebSocket实例在初始化时已经设定了只能进行一个订阅的操作！`;
}

function WebSocketSend( ws, data ){
    if( !( CT.isString( data ) || CT.isArrayBuffer( data ) || CT.isBlob( data ) || CT.isDataView( data ) || CT.isObject( data ) || CT.isArray( data ) ) ){
        throw new Error( `当前数据类型是：“${ CT.dataT( data )
                                        .slice( 8, -1 ) }”，通过“WebSocket”发送到“服务器”的数据类型必须是其中之一：“String”、“ArrayBuffer”、“Blob”、“DataView”、“Object”、“Array”！` );
    }

    ws.send( data );
}

class S2GQL4WS
    extends WebSocket4Client {

    /**
     * 是否在一个WebSocket里头进行多个订阅的操作。<br />
     * PS：<br />
     * 1、为true时，在一个WebSocket里头开启多个订阅的操作；<br />
     * 2、为false时，在一个WebSocket里头关闭多个订阅的操作；<br />
     *
     * @type {boolean} 默认值是false
     */
    #isMultipleSubscription = false;

    /**
     * 当id已经存在时，是否强制覆盖之前的。<br />
     * PS：<br />
     * 1、为true时，当id已经存在时，不会有警告、错误等信息，将会直接覆盖先前的；<br />
     * 2、为false时，当id已经存在时，会报错，而且不会直接覆盖先前的；<br />
     *
     * @type {boolean} 默认值是false
     */
    #isForceCover = false;

    /**
     * “订阅”操作响应后的“处理函数”的队列
     *
     * @type {*[]}
     */
    #messageHandleQueue = [];

    /**
     * 待发送的“客户端WebSocket消息”的队列
     *
     * @type {*[]}
     */
    #toBeSendQueue = [];

    /**
     * 构造函数
     *
     * @param url
     *
     * @param protocols
     *
     * @param isConnectionInit
     *
     * @param isMultipleSubscription
     *
     * @param isForceCover
     */
    constructor( {
                     url = wsURL_strC,
                     protocols = 'graphql-ws',
                     isConnectionInit = true,
                     isMultipleSubscription = false,
                     isForceCover = false,
                 } = {} ){
        super( url, {
            protocols,
            onOpen: ( () => {
                if( CT.isBoolean( isConnectionInit ) && isConnectionInit ){
                    return ( ws, event ) => void ( WebSocketSend( ws, JSON.stringify( init_objC ) ) );
                }

                if( CT.isObject( isConnectionInit ) && !CT.isEmpty( isConnectionInit ) ){
                    return ( ws, event ) => void ( WebSocketSend( ws, JSON.stringify( {
                        ...init_objC,
                        payload: {
                            ...isConnectionInit,
                        },
                    } ) ) );
                }

                if( CT.isFunction( isConnectionInit ) ){
                    return isConnectionInit;
                }

                return ( ws, event ) => {
                };
            } )(),
        } );

        this.#isForceCover = isForceCover;
        this.#isMultipleSubscription = isMultipleSubscription;
    }

    /**
     * 开始订阅
     *
     * @param id
     *
     * @param payload
     *
     * @param messageHandle
     */
    start( {
               id = throw new Error( 'id必传且唯一！' ),
               payload = {},
               messageHandle = ( ws, event, data ) => {
               },
           } = {} ){
        const state_numC = this.getReadyState(),
            id_strC = new String( id ).valueOf(),
            data4WS = JSON.stringify( {
                ...start_objC,
                id: id_strC,
                payload,
            } ),
            messageHandle_objC = {
                [ id_strC ]: messageHandle,
            },
            send_objC = {
                [ id_strC ]: data4WS,
            };

        let index = null;

        switch( state_numC ){
        case 0:
            if( this.#isMultipleSubscription && this.#isForceCover ){
                index = this.#getMessageHandleQueue()
                            .findIndex( ( c, i, a ) => Object.keys( c )
                                                             .includes( id_strC ) );

                if( index === -1 ){
                    this.#addMessageHandleQueue( messageHandle_objC );
                }
                else if( index > -1 ){
                    this.#mutationMessageHandleQueue( 'splice', index, 1, messageHandle_objC );
                }
                else{
                    throw new Error( `index(${ index })值异常！` );
                }

                this.#addToBeSendQueue( send_objC );
            }
            else if( this.#isMultipleSubscription && !this.#isForceCover ){
                index = this.#getMessageHandleQueue()
                            .findIndex( ( c, i, a ) => Object.keys( c )
                                                             .includes( id_strC ) );

                if( index === -1 ){
                    this.#addMessageHandleQueue( messageHandle_objC );

                    this.#addToBeSendQueue( send_objC );
                }
                else if( index > -1 ){
                    new Error( `id(${ id })已存在！不能再订阅了！` );
                }
                else{
                    throw new Error( `index(${ index })值异常！` );
                }
            }
            else if( !this.#isMultipleSubscription && this.#getMessageHandleQueue().length === 0 ){
                this.#addMessageHandleQueue( messageHandle_objC );

                this.#addToBeSendQueue( send_objC );
            }
            else{
                new Error( GetError2() );
            }

            new Error( CONNECTING );

            break;
        case 1:
            if( this.#isMultipleSubscription && this.#isForceCover ){
                index = this.#getMessageHandleQueue()
                            .findIndex( ( c, i, a ) => Object.keys( c )
                                                             .includes( id_strC ) );

                if( index === -1 ){
                    this.#addMessageHandleQueue( messageHandle_objC );
                }
                else if( index > -1 ){
                    this.#mutationMessageHandleQueue( 'splice', index, 1, messageHandle_objC );
                }
                else{
                    throw new Error( `index(${ index })值异常！` );
                }

                WebSocketSend( this, data4WS );
            }
            else if( this.#isMultipleSubscription && !this.#isForceCover ){
                index = this.#getMessageHandleQueue()
                            .findIndex( ( c, i, a ) => Object.keys( c )
                                                             .includes( id_strC ) );

                if( index === -1 ){
                    this.#addMessageHandleQueue( messageHandle_objC );

                    WebSocketSend( this, data4WS );
                }
                else if( index > -1 ){
                    new Error( `id(${ id })已存在！不能再订阅了！` );
                }
                else{
                    throw new Error( `index(${ index })值异常！` );
                }
            }
            else if( !this.#isMultipleSubscription && this.#getMessageHandleQueue().length === 0 ){
                this.#addMessageHandleQueue( messageHandle_objC );

                WebSocketSend( this, data4WS );
            }
            else{
                new Error( GetError2() );
            }

            break;
        case 2:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSING );

            break;
        case 3:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSED );

            break;
        default:
            throw new Error( GetError1( state_numC ) );

            break;
        }
    }

    /**
     * 暂停订阅
     *
     * @param id
     */
    pause( id ){
        const state_numC = this.getReadyState();

        switch( state_numC ){
        case 0:
            break;
        case 1:
            break;
        case 2:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSING );

            break;
        case 3:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSED );

            break;
        default:
            throw new Error( GetError1( state_numC ) );

            break;
        }
    }

    /**
     * 继续订阅
     *
     * @param id
     */
    resume( id ){
        const state_numC = this.getReadyState();

        switch( state_numC ){
        case 0:
            break;
        case 1:
            break;
        case 2:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSING );

            break;
        case 3:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSED );

            break;
        default:
            throw new Error( GetError1( state_numC ) );

            break;
        }
    }

    /**
     * 停止订阅
     *
     * @param id
     */
    stop( id ){
        const state_numC = this.getReadyState();

        switch( state_numC ){
        case 0:
            break;
        case 1:
            break;
        case 2:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSING );

            break;
        case 3:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSED );

            break;
        default:
            throw new Error( GetError1( state_numC ) );

            break;
        }
    }

    /**
     * 关闭本WebSocket连接
     */
    closeWS(){
        const state_numC = this.getReadyState();

        switch( state_numC ){
        case 0:
            break;
        case 1:
            break;
        case 2:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSING );

            break;
        case 3:
            this.#clearMessageHandleQueue();
            this.#clearToBeSendQueue();

            new Error( CLOSED );

            break;
        default:
            throw new Error( GetError1( state_numC ) );

            break;
        }
    }

    on( id, handle ){

    }

    off( id ){
    }

    /**
     * 在“订阅”操作响应后的“处理函数”的队列中追加一项
     *
     * @param obj JSON对象，必传<br />
     * 格式如下：<br />
     *
     * @returns {number} 追加后的队列的最新长度
     */
    #addMessageHandleQueue( obj ){
        return this.#mutationMessageHandleQueue( 'push', obj );
    }

    /**
     * 在待发送的“客户端WebSocket消息”的队列中追加一项
     *
     * @param obj JSON对象，必传<br />
     * 格式如下：<br />
     *
     * @returns {number} 追加后的队列的最新长度
     */
    #addToBeSendQueue( obj ){
        return this.#mutationToBeSendQueue( 'push', obj );
    }

    /**
     * 根据“id”删除“订阅”操作响应后的“处理函数”的队列中的指定项<br />
     * PS：<br />
     * 1、返回值为“undefined”时，说明没有找到对应项，也就没有发生删除的操作。<br />
     * 2、返回值为非“undefined”时，说明找到对应项，并成功发生删除的操作。<br />
     *
     * @param id 字符串，必传
     *
     * @returns {undefined|*} 返回值为：undefined或非undefined的其他数据类型的值。
     */
    #deleteItem4MessageHandleQueue( id ){
        const index_numC = this.#getMessageHandleQueue()
                               .findIndex( ( c, i, a ) => Object.keys( c )
                                                                .includes( new String( id ).valueOf() ) );

        if( index_numC === -1 ){
            console.warn( `“订阅”操作响应后的“处理函数”的队列中不存在该项(id：${ id })！` );

            return undefined;
        }

        return this.#mutationMessageHandleQueue( 'splice', index_numC, 1 );
    }

    /**
     * 根据“id”删除待发送的“客户端WebSocket消息”的队列中的指定项<br />
     * PS：<br />
     * 1、返回值为“undefined”时，说明没有找到对应项，也就没有发生删除的操作。<br />
     * 2、返回值为非“undefined”时，说明找到对应项，并成功发生删除的操作。<br />
     *
     * @param id 字符串，必传
     *
     * @returns {undefined|*} 返回值为：undefined或非undefined的其他数据类型的值。
     */
    #deleteItem4ToBeSendQueue( id ){
        const index_numC = this.#getToBeSendQueue()
                               .findIndex( ( c, i, a ) => Object.keys( c )
                                                                .includes( new String( id ).valueOf() ) );

        if( index_numC === -1 ){
            console.warn( `待发送的“客户端WebSocket消息”的队列中不存在该项(id：${ id })！` );

            return undefined;
        }

        return this.#mutationToBeSendQueue( 'splice', index_numC, 1 );
    }

    /**
     * 清空“订阅”操作响应后的“处理函数”的队列
     */
    #clearMessageHandleQueue(){
        this.#messageHandleQueue = [];
    }

    /**
     * 清空待发送的“客户端WebSocket消息”的队列
     */
    #clearToBeSendQueue(){
        this.#toBeSendQueue = [];
    }

    /**
     * 修改并变更“订阅”操作响应后的“处理函数”的队列里头的项目<br />
     *
     * @param mutationName 字符串，变更的操作名，必须
     *
     * @param handle rest参数列表，依据上面的“变更的操作名”来具体传就行，必须
     *
     * @returns {*}
     */
    #mutationMessageHandleQueue( mutationName, ...handle ){
        return this.#messageHandleQueue[ mutationName ]( ...handle );
    }

    /**
     * 修改并变更待发送的“客户端WebSocket消息”的队列里头的项目<br />
     *
     * @param mutationName 字符串，变更的操作名，必须
     *
     * @param handle rest参数列表，依据上面的“变更的操作名”来具体传就行，必须
     *
     * @returns {*}
     */
    #mutationToBeSendQueue( mutationName, ...handle ){
        return this.#toBeSendQueue[ mutationName ]( ...handle );
    }

    /**
     * 获取“订阅”操作响应后的“处理函数”的队列
     *
     * @returns {*[]}
     */
    #getMessageHandleQueue(){
        return this.#messageHandleQueue;
    }

    /**
     * 获取待发送的“客户端WebSocket消息”的队列
     *
     * @returns {*[]}
     */
    #getToBeSendQueue(){
        return this.#toBeSendQueue;
    }

}

export {
    S2GQL4WS,
};

export default S2GQL4WS;
