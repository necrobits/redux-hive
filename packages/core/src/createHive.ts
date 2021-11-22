import _ from "lodash";
import {all} from "@redux-saga/core/effects";
import type {Saga} from "redux-saga";
import { Reducer } from "redux";
import { createReducer, ReducerMap } from "./createReducer";
import {  ActionMap, ActionPattern } from "./createAction";


type HiveConfig<S=any> = {
    name: string;
    initialState: S;
    reducers: ReducerMap<S>;
    reducerBuilder?: (builder: ReducerBuilder<S>) => void;
    sagas?: Saga[];
};

export interface Hive<S=any> {
    name: string;
    reducer: Reducer<S>;
    actions: ActionMap;
    saga?: Saga;  
}

export interface ReducerBuilder<S> {
    add(pattern: ActionPattern, reducer: Reducer<S>): void
}


export function createHive<S>({
    name,
    initialState,
    reducers,
    reducerBuilder = undefined,
    sagas = undefined,
}: HiveConfig<S>): Hive<S> {
    // Create reducers from builder and add actions to the Hive
    const actions: ActionMap = {};
    if (!!reducerBuilder){
        const builder = {
            add(pattern: ActionPattern, reducer: Reducer<S>){
                let typeName: string;
                if (_.isString(pattern)){
                    typeName = pattern;
                } else {
                    typeName = pattern.type;
                    actions[typeName] = pattern;
                }
                reducers[typeName] = reducer;
            }
        }
        reducerBuilder(builder);
    }

    
    const reducer = createReducer<S>({ initialState, reducers });
    const hive: Hive<S> = {
        name: name,
        reducer: reducer,
        actions: actions,
    };

    if (sagas?.length || 0 > 0){
        const saga = function*(){
            yield all([...sagas!]);
        }
        hive.saga = saga;
    }

    return hive;
};
