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
 *      nextActionSuccess: () => {}
 *      nextActionFailure: () => {}
 *      prevActionRequest: () => {}
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
            nextActionSuccess = () => {},
            nextActionFailure = () => {},
            prevActionRequest = () => {}
        } = reduceCfg;

        handlers[loadingActionName] = (state) => {
            state[loading] = true;
            if(success) {
                state[success] = defaultValue;
            }
            state[error] = null;
            prevActionRequest()
            delete state[null];
        };

        handlers[successActionName] = (state, action) => {
            state[loading] = false;
            if(success) {
                state[success] = action.payload;
            }
            state[error] = null;
            nextActionSuccess()
            delete state[null];
        };

        handlers[failureActionName] = (state, action) => {
            state[loading] = false;
            if(success) {
                state[success] = defaultValue;
            }
            state[error] = action.payload;
            nextActionFailure()
            delete state[null];
        };

        handlers[resetActionName] = (state) => {
            state[loading] = false;
            if(success) {
                state[success] = defaultValue;
            }
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
