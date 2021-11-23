import {applyMiddleware, combineReducers, compose, createStore, Middleware, Store} from "redux"
import {all} from "@redux-saga/core/effects";

import {Hive} from "./createHive"
import createSagaMiddleware from "@redux-saga/core";

export type HiveStoreConfig = {
    hives: Hive[];
    middlewares: Middleware[],
    devtools?: boolean,
}

export default function ({
                             hives,
                             middlewares,
                             devtools = true,
                         }: HiveStoreConfig): Store {
    // Combine reducers from the hives    
    const rootReducerConfig = {};
    for (let hive of hives) {
        rootReducerConfig[hive.name] = hive.reducer;
    }
    const rootReducer = combineReducers(rootReducerConfig);

    // Combine sagas from the hives
    const sagaEffects = hives.map(h => h.saga).filter(s => !!s).map(s => s!());
    const rootSaga = function* () {
        yield all([...sagaEffects]);
    }

    // Apply middlewares
    const sagaMiddleware = createSagaMiddleware();
    let composeEnhancers = compose;
    if (devtools) {
        composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(...middlewares, sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    return store;
}