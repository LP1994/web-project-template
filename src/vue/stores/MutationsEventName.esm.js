/**
 * Project: WebProTpl
 * Author: 12278
 * Email: 2726893248@qq.com
 * CreateDate: 2019-01-01 00:00:00
 * IDE: WebStorm
 */

'use strict';

let CT = new CTESM.CT();

const MutationsEventName = CT.deepFreeze( {
    addCountAMutation: 'addCountAMutation',
    subCountAMutation: 'subCountAMutation',
} );

export {
    MutationsEventName,
};

export default MutationsEventName;
