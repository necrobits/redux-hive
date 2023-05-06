import { applyMiddleware, combineReducers, compose, createStore, Middleware, Store } from "redux"
import { all } from "@redux-saga/core/effects";

import { Hive, HiveConfig, createHive } from "./createHive"
import createSagaMiddleware from "@redux-saga/core";
import { ReducersMapObject } from "redux";

export type HiveStoreConfig = {
    hives: (Hive | HiveConfig)[];
    middlewares: Middleware[],
    enhancers?: Function[],
    enableDevTools?: boolean,
}

function isHiveConfig(hive: Hive | HiveConfig): hive is HiveConfig {
    return hive.hasOwnProperty('initialState');
}

export default function ({
    hives,
    middlewares,
    enhancers = [],
    enableDevTools = true,
}: HiveStoreConfig): Store {
    // Combine reducers from the hives    
    const rootReducerConfig: ReducersMapObject = {};
    for (let hive of hives) {
        if (isHiveConfig(hive)) {
            hive = createHive(hive);
        }
        rootReducerConfig[hive.name] = hive.reducer;
    }
    const rootReducer = combineReducers(rootReducerConfig);

    // Combine sagas from the hive
    const sagaEffects = hives.map((h: Hive) => h.saga)
        .filter(s => !!s)
        .map(s => s!());

    const rootSaga = function* () {
        yield all([...sagaEffects]);
    }

    // Apply middlewares
    const sagaMiddleware = createSagaMiddleware();
    let composeEnhancers = compose;
    if (enableDevTools) {
        composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(...middlewares, sagaMiddleware), ...enhancers)
    );
    sagaMiddleware.run(rootSaga);
    return store;
}