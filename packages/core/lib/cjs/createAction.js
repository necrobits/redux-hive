"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = void 0;
var lodash_1 = __importDefault(require("lodash"));
function createAction(name, payloadOrPayloadFn) {
    var actionCreator = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var payload = payloadOrPayloadFn;
        if (lodash_1.default.isFunction(payloadOrPayloadFn)) {
            payload = payloadOrPayloadFn.apply(void 0, args);
        }
        return {
            type: name,
            payload: payload,
        };
    };
    actionCreator.type = name;
    return actionCreator;
}
exports.createAction = createAction;
