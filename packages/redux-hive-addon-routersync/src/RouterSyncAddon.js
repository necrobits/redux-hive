import * as queryString from "query-string";
import {call, put, takeEvery} from "@redux-saga/core/effects";
import {eventChannel} from "redux-saga";

const routerSyncActionName = "@@redux-hive/routersync";
// Adapter for 'history' v4
const defaultLocationAdapter = (location) => location;

function locationEventChannel(history, adapter) {
    return eventChannel(emit => {
        return history.listen((obj) => emit(adapter(obj)));
    })
}

function makeStateFromLocation(location) {
    const query = queryString.parse(location.search);
    const pathname = location.pathname;
    const hash = queryString.parse(location.hash);
    return {
        pathname,
        query,
        hash,
        state: location.state || null,
        key: location.key
    }
}


function RouterSyncAddon(history, {
    adapter = defaultLocationAdapter,
} = {}) {
    const querySaga = function* () {
        const channel = yield call(locationEventChannel, history, adapter);
        yield takeEvery(channel, function* (location) {
            yield put({
                type: routerSyncActionName,
                payload: makeStateFromLocation(location)
            });
        })
    };
    const handlers = {
        [routerSyncActionName]: (state, action) => {
            state.pathname = action.payload.pathname;
            state.query = action.payload.query;
            state.hash = action.payload.hash;
            state.key = action.payload.key;
            state.state = action.payload.state;
        }
    };
    return {
        initialState: makeStateFromLocation(history.location),
        handlers,
        sagas: [querySaga()]
    }
}

export default RouterSyncAddon;
