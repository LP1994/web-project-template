/**
 * Project: sn-data-center-platform-micro-front-web
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2020-11-02 14:52:47
 * IDE: WebStorm
 */

'use strict';

// 这是一个事件的发布、订阅的工具类

class Events4PublishSubscribe {

    /**
     * 私有属性，用于存储事件(模拟队列)
     *
     * @type {{}} 对象
     */
    #events4Queue = {};

    /**
     * 私有方法，用于事件的初始化
     *
     * @param type 字符串，事件名，必须的
     */
    #init( type ){
        !this.#events4Queue[ type ] && ( this.#events4Queue[ type ] = [] );
    }

    /**
     * 类的构造函数
     */
    constructor(){
    }

    /**
     * 根据指定的事件名注册指定的事件
     *
     * @param type 字符串，事件名，必须的
     *
     * @param fn 函数(建议用function函数，而不是箭头函数)，可选的
     *
     * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用
     */
    on( type, fn = function (){
    } ){
        this.#init( type );

        this.#events4Queue[ type ].push( fn );

        return this;
    }

    /**
     * 根据指定的事件名注册一个只执行一次的指定事件
     *
     * @param type 字符串，事件名，必须的
     *
     * @param fn 函数(建议用function函数，而不是箭头函数)，可选的
     *
     * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用
     */
    once( type, fn = function (){
    } ){
        this.#init( type );

        let _this = this;

        this.#events4Queue[ type ].push( function once( ...args ){
            fn( ...args );

            _this.off( type, once );
        } );

        return this;
    }

    /**
     * 根据指定的事件名触发其拥有的所有事件
     *
     * @param type 字符串，事件名，必须的
     *
     * @param params rest参数列表，一个个参数都是传给即将被调用的事件函数，可选的
     *
     * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用
     */
    emit( type, ...params ){
        this.#events4Queue[ type ] && ( this.#events4Queue[ type ].forEach( fn => fn( ...params ) ) );

        return this;
    }

    /**
     * 根据指定的事件名注销其所有事件中的一个指定事件函数
     *
     * @param type 字符串，事件名，必须的
     *
     * @param fn 函数(建议用function函数，而不是箭头函数)，就是当初注册事件时用的那个存着注册事件函数的那个变量，必须的
     *
     * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用
     */
    off( type, fn ){
        this.#events4Queue[ type ] && ( this.#events4Queue[ type ] = this.#events4Queue[ type ].filter( cb => fn !== cb ) );

        return this;
    }

    /**
     * 清除所有的事件队列
     *
     * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用
     */
    clearAllEventsQueue(){
        this.#events4Queue = {};

        return this;
    }

    /**
     * 根据指定的事件名清除其所有的事件，并且也会删除这个事件名
     *
     * @param type 字符串，事件名，必须的
     *
     * @returns {Events4PublishSubscribe} Events4PublishSubscribe类的实例，方便链式调用
     */
    delEventQueue4Type( type ){
        this.#events4Queue[ type ] && ( delete this.#events4Queue[ type ] );

        return this;
    }

    /**
     * 获取所有的事件队列
     *
     * @returns {{}} 对象
     */
    getAllEventsQueue(){
        return this.#events4Queue;
    }

    /**
     * 根据指定的事件名获取其所有的事件，不存在指定的事件名，就会返回undefined
     *
     * @param type 字符串，事件名，必须的
     *
     * @returns {[]|undefined} 数组|undefined，不存在指定的事件名，就会返回undefined
     */
    getEventQueue4Type( type ){
        return this.#events4Queue[ type ];
    }

}

export {
    Events4PublishSubscribe,
};

export default Events4PublishSubscribe;
