import _ from "lodash";
import {makeActionName} from "./utils";

/**
 * Each instance of this addon must be bound to only 1 reducer.
 * @param config: a map of following format
 * {
 *  [apiCallName] : {
 *      loading: 'loading',
 *      success: 'name',
 *      error: null,
 *      defaultValue: [],
 *  }
 * }
 * @param targetReducer: name of the target reducer. If this addon is being used in reducer-level, then there is no need to specify this.
 * destination can be a string ( attribute name in state ) or a function (state, payload) => state
 */
function ApiReduceAddon(config, targetReducer) {
    const handlers = {};
    _.forIn(config, (reduceCfg, apiCallName) => {
        const loadingActionName = makeActionName(apiCallName, 'REQUEST');
        const successActionName = makeActionName(apiCallName, 'SUCCESS');
        const failureActionName = makeActionName(apiCallName, 'FAILURE');
        const resetActionName = makeActionName(apiCallName, 'RESET');
        const {
            loading = 'loading',
            success,
            error = 'error',
            defaultValue = null,
        } = reduceCfg;

        handlers[loadingActionName] = (state) => {
            state[loading] = true;
            state[success] = defaultValue;
            state[error] = null;
            delete state[null];
        };

        handlers[successActionName] = (state, action) => {
            state[loading] = false;
            state[success] = action.payload;
            state[error] = null;
            delete state[null];
        };

        handlers[failureActionName] = (state, action) => {
            state[loading] = false;
            state[success] = defaultValue;
            state[error] = action.payload;
            delete state[null];
        };

        handlers[resetActionName] = (state) => {
            state[loading] = false;
            state[success] = defaultValue;
            state[error] = null;
            delete state[null];
        };

    });
    return {
        target: targetReducer,
        handlers,
    };

}

export {
    ApiReduceAddon
};