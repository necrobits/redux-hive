import createSagaMiddleware from 'redux-saga';
import {combineReducers} from 'redux';
import {all} from '@redux-saga/core/effects';
import {applyMiddleware, compose} from 'redux';
import {createStore} from 'redux';
import createReducer from './createReducer';

export default function (
    {
        reducers = {},
        sagas = [],
        middlewares = [],
        addons = [],
    }) {
    _.forEach(addons, function (addon) {
        const addonSagas = addon.sagas || [];
        const addonMiddlewares = addon.middlewares || [];
        sagas = _.concat(addonSagas);
        middlewares = _.concat(addonMiddlewares);
    });
    const _reducers = _.mapValues(reducers, (cfg) => createReducer(cfg));
    _.forIn(reducers, (reducerCfg) => {
        _.forEach(reducerCfg.addons || [], (addon) => {
            sagas = _.concat(sagas, addon.sagas || []);
            middlewares = _.concat(middlewares, addon.middlewares || []);
        })
    });

    const rootReducer = combineReducers(_reducers);
    const rootSaga = function* () {
        yield all([...sagas]);
    };

    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // Prevent recomputing reducers for `replaceReducer`
                shouldHotReload: false,
            })
            : compose;

    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares, sagaMiddleware)));
    sagaMiddleware.run(rootSaga);
    return store;
}
