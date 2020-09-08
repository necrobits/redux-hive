import {put, takeEvery} from "@redux-saga/core/effects";
import request from "./request";
import {makeAction} from "./utils";
import _ from "lodash";

const BEE_HTTP_REQUEST = '@@redux-hive/api/_call';

function createApiAction(name, {
    url,
    method = 'GET',
    headers = {},
    query = {},
    type = 'json',
}) {
    return {
        type: BEE_HTTP_REQUEST,
        name: name,
        payload: {url, method, headers, query, type},
    }
}

function* callApi({name, payload}) {
    const {
        url,
        method = 'GET',
        headers = {},
        query = {},
        type = 'json',
    } = payload;
    try {
        yield put(makeAction(name, 'REQUEST'));
        const response = yield request(url, {method, query, headers, type});
        if (response.ok) {
            yield put(makeAction(name, 'SUCCESS', response.body));
        } else {
            yield put(makeAction(name, 'FAILURE', response));
        }
    } catch (e) {
        yield put(makeAction(name, 'FAILURE', e));
    }
}

function headerInjectorMiddleware(headerCreator) {
    return function () {
        return function (next) {
            return function (action) {
                if (action.type === BEE_HTTP_REQUEST){
                    const additionalHeaders = headerCreator();
                    action.payload.headers = _.merge(action.payload.headers, additionalHeaders);
                }
                return next(action)
            }
        }
    }
}

function ApiAddon({
    injectHeader
                  }) {
    const requestSaga = function* () {
        yield takeEvery(BEE_HTTP_REQUEST, callApi);
    };
    const middlewares = [];
    if (_.isFunction(injectHeader)){
        middlewares.push(headerInjectorMiddleware(injectHeader));
    }
    return {
        sagas: [requestSaga()],
        middlewares,
    };
}

export {
    ApiAddon, createApiAction
};