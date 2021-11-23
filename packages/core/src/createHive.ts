import _ from "lodash";
import {all} from "@redux-saga/core/effects";
import type {Saga} from "redux-saga";
import {createReducer, Reducer, ReducerMap, ReducerOrModifier} from "./createReducer";
import {ActionMap, ActionPattern} from "./createAction";

export interface ReducerBuilder<S> {
    add(pattern: ActionPattern, reducer: ReducerOrModifier<S>): void
}

type HiveConfig<S = any> = {
    name: string;
    initialState: S;
    reducers?: ReducerMap<S>;
    reducerBuilder?: (builder: ReducerBuilder<S>) => void;
    sagas?: Saga[];
};

export interface Hive<S = any> {
    name: string;
    reducer: Reducer<S>;
    actions: ActionMap;
    saga?: Saga;
}

export function createHive<S>({
                                  name,
                                  initialState,
                                  reducers = {},
                                  reducerBuilder = undefined,
                                  sagas = undefined,
                              }: HiveConfig<S>): Hive<S> {
    // Create reducers from builder and add actions to the Hive
    const actions: ActionMap = {};
    if (!!reducerBuilder) {
        const builder = {
            add(patterns: ActionPattern, reducer: ReducerOrModifier<S>) {
                let typeName: string;
                if (!_.isArray(patterns)) {
                    patterns = [patterns];
                }
                for (let pattern of patterns) {
                    if (_.isString(pattern)) {
                        typeName = pattern;
                    } else {
                        typeName = pattern.type;
                        actions[typeName] = pattern;
                    }
                    reducers[typeName] = reducer;
                }
            }
        }
        reducerBuilder(builder);
    }


    const reducer = createReducer<S>({initialState, reducers});
    const hive: Hive<S> = {
        name: name,
        reducer: reducer,
        actions: actions,
    };

    if (sagas?.length || 0 > 0) {
        const saga = function* () {
            yield all([...sagas!.map(s => s())]);
        }
        hive.saga = saga;
    }

    return hive;
};
