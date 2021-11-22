import { produce } from 'immer';
import _ from 'lodash';
export function createReducer(_a) {
    var initialState = _a.initialState, reducers = _a.reducers, _b = _a.usingImmer, usingImmer = _b === void 0 ? true : _b;
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        if (!_.has(reducers, action.type)) {
            return state;
        }
        var reducer = reducers[action.type];
        if (!usingImmer) {
            return reducer(state, action);
        }
        var nextState = produce(state, function (draft) {
            reducer(draft, action);
        });
        if (!nextState) {
            return state;
        }
        return state;
    };
}
