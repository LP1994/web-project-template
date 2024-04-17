/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

// 一个基于CT二次封装的JS工具，用于该项目发起GraphQL请求的WebService客户端

'use strict';

let CT = new CTESM.CT();
let {
    WebService4Proxy,
} = CT.getClass();

/*
 devURL4HZJDev8087A: 黄总监的开发服(连公司有线局域网，端口：8087) http://192.168.1.196:8087/graphql
 devURL4HZJDev8087B: 黄总监的开发服(连刘家敏电脑的无线网络，端口：8087) http://192.168.137.137:8087/graphql

 devURL4Natapp: 内网穿透 http://sn2020a.nat300.top/graphql

 testURL: 测试服 http://192.168.1.101:8080/graphql

 devURL4DLG8099A: 邓龙光(连公司有线局域网，端口：8099) http://192.168.1.167:8099/graphql
 devURL4DLG8099B: 邓龙光(连刘家敏电脑的无线网络，端口：8099) http://192.168.137.123:8099/graphql
 devURL4DLG8099C: 邓龙光(连吴丹桦电脑的无线网络，端口：8099) http://192.168.137.236:8099/graphql

 devURL4XJB8099A: 许锦滨(连公司有线局域网，端口：8099) http://192.168.1.153:8099/graphql
 devURL4XJB8099B: 许锦滨(连刘家敏电脑的无线网络，端口：8099) http://192.168.137.217:8099/graphql
 devURL4XJB8099C: 许锦滨(连吴丹桦电脑的无线网络，端口：8099) http://192.168.137.73:8099/graphql

 devURL4LDM8081A: 李东明(连公司有线局域网，端口：8081) http://192.168.1.123:8081/graphql
 devURL4LDM8081B: 李东明(连吴丹桦电脑的无线网络，端口：8081) http://192.168.137.208:8081/graphql

 devURL4DHT8081A: 戴海涛(连公司有线局域网，端口：8081) http://192.168.1.147:8081/graphql
 */
const webService_insC = new WebService4Proxy( CT, `${ devURL4HZJDev8087A }` ),
    post4JSON = webService_insC.post( {
        type: 'json',
    } ),
    requestOpt = {
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip',
        },
        mode: 'cors',
        // "include" | "omit" | "same-origin"
        credentials: 'same-origin',
        cache: 'no-cache',
    };

/**
 * 该函数只接受一个参数，且该参数是一个JSON配置对象，有如下三个字段：<br />
 * {<br />
 * url 字符串，默认值：'/'，一般不用传，保持默认值就行，可选<br /><br />
 *
 * options JSON配置对象，该参数的具体信息看CT的fetch()的第三个参数描述，必传<br /><br />
 *
 * events JSON配置对象，该参数的具体信息看CT的fetch()的第二个参数描述，必传<br /><br />
 *
 * @returns {Promise} Promise实例
 */
function post4JSON2GraphQL( {
                                url = '/',
                                options = {
                                    body: null,
                                },
                                events = {
                                    success: ( data4ResponseType, response ) => {
                                    },
                                    error: ( status_num, response ) => {
                                        console.warn( `请求未成功！请求状态码：${ status_num }！Start` );
                                        console.error( response );
                                        console.warn( `请求未成功！请求状态码：${ status_num }！End` );
                                    },
                                },
                            } = throw new Error( '参数必传！' ) ){
    let {
        body = null,
    } = options;

    ( CT.isArray( body ) || CT.isObject( body ) ) && ( body = JSON.stringify( body ) );

    return post4JSON.graphql( {
        url,
        options: Object.assign( {}, requestOpt, options, { body, }, ),
        events,
    } );
}

export {
    post4JSON,
    requestOpt,
    post4JSON2GraphQL,
};

export default post4JSON2GraphQL;
