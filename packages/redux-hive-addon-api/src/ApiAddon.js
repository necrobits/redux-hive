import {put, takeEvery} from "@redux-saga/core/effects";
import request from "./request";
import {makeAction} from "./utils";

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

function compileCallApi(opts = {}){
    return function* callApi({name, payload}) {
        const {
            url,
            method = 'GET',
            headers = {},
            query = {},
            type = 'json',
        } = payload;
        try {
            yield put(makeAction(name, 'REQUEST'));
            const response = yield request(url, {method, query, headers, type}, opts);
            if (response.ok) {
                yield put(makeAction(name, 'SUCCESS', response.body));
            } else {
                yield put(makeAction(name, 'FAILURE', response));
            }
        } catch (e) {
            yield put(makeAction(name, 'FAILURE', e));
        }
    }
}

function ApiAddon(opts) {
    const requestSaga = function* () {
        yield takeEvery(BEE_HTTP_REQUEST, compileCallApi(opts));
    };
    return {
        sagas: [requestSaga()],
    };
}

export {
    ApiAddon, createApiAction
};