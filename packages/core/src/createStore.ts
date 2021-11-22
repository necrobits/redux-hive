import { applyMiddleware, combineReducers, compose, createStore, Middleware, Store } from "redux"
import {all} from "@redux-saga/core/effects";

import { Hive } from "./createHive"
import createSagaMiddleware from "@redux-saga/core";

export type HiveStoreConfig = {
    hives: Hive[];
    middlewares: Middleware[],
}

export default function ({
    hives,
    middlewares,
}: HiveStoreConfig): Store {
    // Combine reducers from the hives    
    const rootReducerConfig = {};
    for (let hive of hives){
        rootReducerConfig[hive.name] = hive.reducer;
    }
    const rootReducer = combineReducers(rootReducerConfig);

    // Combine sagas from the hives
    const sagas = hives.map(h => h.saga).filter(s => !!s);
    const rootSaga = function*(){
        yield all([...sagas]); 
    }
    
    // Apply middlewares
    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(...middlewares, sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    return store;
}