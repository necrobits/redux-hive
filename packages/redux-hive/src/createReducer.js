import _ from "lodash";
import {produce} from "immer";

function createReducer(
    {
        initialState = {},
        handlers = {},
        addons = [],
    } = {}) {
    let _initialState = initialState;
    let _handlers = handlers;
    _.forEach(addons, (addon) => {
        const addonState = addon.initialState || {};
        const addonHandlers = addon.handlers || [];
        _initialState = _.merge(_initialState, addonState);
        _handlers = _.merge(_handlers, addonHandlers);
    });

    return (state = _initialState, action) => {
        if (_.has(_handlers, action.type)) {
            let handlerCfg = _handlers[action.type];
            if (!_.isArray(handlerCfg)) {
                handlerCfg = [handlerCfg];
            }
            let [handler, options] = handlerCfg;

            if (!_.get(options, 'autoImmer', true)) {
                return handler(state, action);
            }
            return produce(state, draftState => handler(draftState, action));
        }
        return state;
    };
}

export default createReducer;