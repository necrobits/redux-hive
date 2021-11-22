import _ from "lodash";
export function createAction(name, payloadOrPayloadFn) {
    var actionCreator = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var payload = payloadOrPayloadFn;
        if (_.isFunction(payloadOrPayloadFn)) {
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
