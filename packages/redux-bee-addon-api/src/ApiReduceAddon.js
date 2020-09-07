import {put, takeEvery} from "@redux-saga/core/effects";
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
 *  }
 * }
 * @param targetReducer: name of the target reducer. If this addon is being used in reducer-level, then there is no need to specify this.
 * destination can be a string ( attribute name in state ) or a function (state, payload) => state
 */
function ApiReduceAddon(config, targetReducer) {
    const handlers = {};
    _.forIn(config, (reduceCfg, apiCallName) => {
        const loadingActionName = makeActionName(apiCallName, 'REQUEST')
        const successActionName = makeActionName(apiCallName, 'SUCCESS')
        const failureActionName = makeActionName(apiCallName, 'FAILURE')
        const {loading = 'loading', success, error = 'error'} = reduceCfg;

        handlers[loadingActionName] = (state, action) => _.omit(({
            ...state,
            [loading]: true,
            [success]: null,
            [error]: null
        }), ['null']);

        handlers[successActionName] = (state, action) => _.omit(({
            ...state,
            [loading]: false,
            [success]: action.payload,
            [error]: null
        }), ['null']);

        handlers[failureActionName] = (state, action) => _.omit(({
            ...state,
            [loading]: false,
            [success]: null,
            [error]: action.payload,
        }), ['null']);

    });
    return {
        target: targetReducer,
        handlers,
    };
}

export {
    ApiReduceAddon
};