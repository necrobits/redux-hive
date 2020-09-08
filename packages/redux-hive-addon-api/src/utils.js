import _ from "lodash";

function makeActionName(name, state) {
    state = state.toUpperCase();
    if (!_.includes(['REQUEST', 'SUCCESS', 'FAILURE', 'RESET'], state)) {
        throw Error(`Invalid state: ${state}. State must be one of REQUEST, SUCCESS, FAILURE, RESET`);
    }
    return `@@redux-hive/api/${name}/${state}`;
}

function makeAction(name, state, payload = undefined) {
    return {
        type: makeActionName(name, state),
        payload: payload,
    };
}

export {
    makeActionName,
    makeAction,
}