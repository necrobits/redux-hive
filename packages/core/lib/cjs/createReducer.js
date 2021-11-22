"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReducer = void 0;
var immer_1 = require("immer");
var lodash_1 = __importDefault(require("lodash"));
function createReducer(_a) {
    var initialState = _a.initialState, reducers = _a.reducers, _b = _a.usingImmer, usingImmer = _b === void 0 ? true : _b;
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        if (!lodash_1.default.has(reducers, action.type)) {
            return state;
        }
        var reducer = reducers[action.type];
        if (!usingImmer) {
            return reducer(state, action);
        }
        var nextState = (0, immer_1.produce)(state, function (draft) {
            reducer(draft, action);
        });
        if (!nextState) {
            return state;
        }
        return state;
    };
}
exports.createReducer = createReducer;
