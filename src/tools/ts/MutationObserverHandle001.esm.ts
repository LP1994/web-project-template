/**
 * Project: sn-data-center-platform-micro-front-web
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2020-09-24 15:01:44
 * IDE: WebStorm
 */

/**
 * MutationObserver工具类
 */

'use strict';

interface Interface2MutationObserverInit001 {
    /*
     设置为true可将监视扩展到以目标为根的节点的整个子树。
     然后，所有其他MutationObserverInit属性将扩展到子树中的所有节点，而不是仅应用于目标节点。
     默认值为false。
     */
    subtree?: boolean;
    /*
     设置为true以监视目标节点（如果subtree为true，则监视其子节点）是否添加了新的子节点或删除了现有的子节点。
     默认值为false。
     */
    childList?: boolean;
    /*
     从Firefox 36开始，属性没有默认值。以前，其默认值为false。

     设置为true可以监视被监视的一个或多个节点上的属性值的更改。
     如果指定了attributeFilter或attributeOldValue中的一个，
     则默认值为true，否则为false。
     */
    attributes: boolean;
    /*
     Internet Explorer 11要求属性：使用attributeFilter时为true。如果不存在attributes:true，则Internet Explorer 11会引发语法错误。
     在Edge 79之前，这需要属性：使用attributeFilter时为true。如果不存在attribute：true，则Edge会引发语法错误。

     要监视的特定属性名称的数组。如果不包括此属性，则对所有属性的更改都将导致突变通知。
     */
    attributeFilter: boolean | Array<string>;
    /*
     从Firefox 36开始，attributeOldValue没有默认值。以前，其默认值为false。

     设置为true可记录在监视一个或多个节点的属性更改时更改的任何属性的先前值；
     有关监视属性更改和值记录的详细信息，请参阅MutationObserver中的监视属性值。
     默认值为false。
     */
    attributeOldValue: boolean;
    /*
     从Firefox 36开始，characterData没有默认值。以前，其默认值为false。

     设置为true可监视指定的目标节点（如果子树为true，则监视其子节点）中包含的字符数据的更改。
     如果指定了characterDataOldValue，
     则默认值为true，否则默认值为false。
     */
    characterData?: boolean;
    /*
     从Firefox 36开始，characterDataOldValue没有默认值。以前，其默认值为false。

     设置为true可以在监视节点上的文本更改时记录该节点文本的先前值。
     有关详细信息和示例，请参阅监视MutationObserver中的文本内容更改。默认值为false。
     */
    characterDataOldValue?: boolean;
}

interface Interface2MutationObserverInit002 {
    element: any;
    callback?: any;
    config?: Interface2MutationObserverInit001;
    isObserve?: boolean;
}

class MutationObserverHandle001 {

    /**
     * DOM树中的DOM节点可能是一个元素，用于监视更改或者是要监视的节点子树的根
     *
     * @type {any}
     *
     * @private
     */
    #element: any;
    /**
     * 一个JSON配置对象
     *
     * @type {any}
     *
     * @private
     */
    #config: any;
    /**
     * 一个MutationObserver实例
     *
     * @type {any}
     *
     * @private
     */
    #observer: any;

    /**
     * 构造函数<br />
     *
     * @param option 一个JSON配置对象，必须<br />
     * {<br />
     * element: DOM树中的DOM节点可能是一个元素，用于监视更改或者是要监视的节点子树的根，必须。<br /><br />
     *
     * callback: 监听的回调函数，可选，该回调函数有两个参数: <br />
     * mutationRecordList: 数组，其中的每个一维成员都是一个数据类型为MutationRecord对象的数据，每个对象描述一个应用于文档DOM树的观察部分的更改。<br />
     * observer: 调用回调函数callback的MutationObserver实例对象。<br />
     * PS:<br />
     * MutationRecord的说明，有如下属性:<br />
     * type: String，如果该突变是属性突变，则返回“attributes”，如果是CharacterData节点的突变，则为“ characterData”和“ childList”（如果它是节点树的突变）。<br />
     * target: Node，根据MutationRecord.type返回受突变影响的节点。对于属性，它是其属性已更改的元素。对于characterData，它是CharacterData节点。对于childList，这是其子项已更改的节点。<br />
     * addedNodes: NodeList，返回添加的节点。如果未添加任何节点，则该节点将为空。<br />
     * removedNodes: NodeList，返回删除的节点。如果未删除任何节点，则该节点将为空。<br />
     * previousSibling: Node，返回添加或删除的节点的上一个兄弟节点，或者为null。<br />
     * nextSibling: Node，返回添加或删除的节点的下一个同级，或者返回null。<br />
     * attributeName: String，返回已更改属性的本地名称，或者为null。<br />
     * attributeNamespace: String，返回已更改属性的名称空间，或者为null。<br />
     * oldValue: String，返回值取决于MutationRecord.type。 对于属性，它是更改前更改的属性的值。 对于characterData，它是更改之前更改的节点的数据。 对于childList，它为null。<br />
     * 请注意，为使此方法按预期工作，必须在MutationObserver观察方法的相应MutationObserverInit参数中将attributeOldValue或characterDataOldValue设置为true<br /><br />
     *
     * config: MutationObserverInit对象提供了一些选项，这些选项描述了应向mutationObserver的回调报告哪些DOM突变，可选，<br />
     * 但是建议看看默认值(attributes、attributeFilter、attributeOldValue都为true)及其使用说明。<br /><br />
     *
     * isObserve: 布尔值，可选，默认是true，表示立刻启用观察者，false表示稍后手动启用观察者。
     */
    constructor( {
                     // @ts-ignore
                     element,
                     callback = (): void => {
                     },
                     // @ts-ignore
                     config = {},
                     isObserve = true,
                 }: Interface2MutationObserverInit002 ) {
        // @ts-ignore
        this.#element = element;
        this.#config = Object.assign( {}, {
            subtree: false,
            childList: false,
            attributes: true,
            attributeFilter: true,
            attributeOldValue: true,
            characterData: false,
            characterDataOldValue: false,
        }, config );

        this.#observer = new MutationObserver( callback );

        isObserve && this.observe();
    }

    /**
     * 返回MutationObserver实例
     *
     * @returns {any}
     */
    getObserver(): any {
        return this.#observer;
    }

    /**
     * 启动观察者<br />
     * 您可以在同一个变体BServer上多次调用obsert（）以查看对DOM树不同部分和/或不同类型更改的更改。有一些注意事项：<br />
     * 如果在同一个变异BServer已经观察到的节点上调用观察（），则在激活新观察者之前，所有现有观察者将自动从所有观察到的目标中删除。<br />
     * 如果目标上尚未使用相同的变异bserver，则将单独使用现有的观察者，并添加新的观察者。<br /><br />
     *
     * PS:<br />
     * observe函数在以下情况下抛出TypeError：<br />
     * 1、配置这些选项，以便实际上不会监视任何内容。（例如，如果MutationObserverInit.childList，MutationObserverInit.attributes和MutationObserverInit.characterData均为false。）<br />
     * 2、options.attributes的值是false（指示不监视属性更改），但是attributeOldValue为true和/或存在attributeFilter。<br />
     * 3、characterDataOldValue选项为true，但MutationObserverInit.characterData为false（指示不监视字符更改）。
     * 4、调用observe()时，至少childList、attributes和characterData之一必须为true。否则，将引发TypeError异常。
     *
     * @param option JSON配置对象，有如下属性：<br />
     * {<br />
     * element: DOM树中的DOM节点可能是一个元素，用于监视更改或者是要监视的节点子树的根，可选，如果不传的话会使用初始化类时传入的element参数值。<br /><br />
     *
     * config: MutationObserverInit对象提供了一些选项，这些选项描述了应向mutationObserver的回调报告哪些DOM突变，可选，如果不传的话会使用初始化类时传入的config参数值。<br />
     *
     * @returns {undefined}
     */
    // @ts-expect-error
    observe( {
                 element,
                 config = {},
             }: {
        element: any,
        config: any
    } = {} ): void {
        this.#observer.observe( element ?? this.#element, Object.assign( {}, this.#config, config ) );
    }

    /**
     * MutationObserver方法takeRecords（）返回已检测到但尚未由观察者的回调函数处理的所有匹配的DOM更改的列表，使变异队列为空。<br />
     * 最常见的用例是在断开观察者之前立即获取所有待处理的突变记录，以便在停止观察者时可以处理任何未决的突变。<br /><br />
     *
     * PS:<br />
     * 1、在“disconnect()”调用前被调用！！！<br />
     * 2、takeRecords函数被调用后会返回一个数组，其中的每个一维成员都是一个数据类型为MutationRecord对象的数据，每个对象描述一个应用于文档DOM树的观察部分的更改。<br />
     * 3、调用takeRecords（）之后，已发生但未传递给观察者回调的变异队列将留空。
     *
     * @returns {Array<any>}
     */
    takeRecords(): Array<any> {
        return this.#observer.takeRecords();
    }

    /**
     * 你也可以停止观察，然后可以通过再次调用其observe()方法来重用观察者。<br /><br />
     *
     * PS:<br />
     * 1、已经检测到但尚未报告给观察者的所有突变通知都将被丢弃。<br />
     * 2、如果将要观察的元素从DOM中删除，然后由浏览器的垃圾回收机制释放，则同样会删除MutationObserver。
     *
     * @returns {undefined}
     */
    disconnect(): void {
        this.#observer.disconnect();
    }

}

export {
    MutationObserverHandle001,
};

export default MutationObserverHandle001;
