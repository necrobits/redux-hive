import * as queryString from "query-string";
import {put, call, take, takeEvery} from "@redux-saga/core/effects";
import {eventChannel} from "redux-saga";

const routerSyncActionName = "@@redux-hive/routersync";

function locationEventChannel(history) {
    return eventChannel(emit => {
        return history.listen(({location}) => emit(location));
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
    }
}


function RouterSyncAddon(history, target = 'router') {
    const querySaga = function* () {
        const channel = yield call(locationEventChannel, history);
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
        }
    }
    return {
        target,
        initialState: makeStateFromLocation(history.location),
        handlers,
        sagas: [querySaga()]
    }
}

export default RouterSyncAddon;