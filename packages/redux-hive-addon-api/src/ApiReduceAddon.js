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
 */
function ApiReduceAddon(config) {
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
        handlers,
    };

}

export {
    ApiReduceAddon
};
