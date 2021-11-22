import type { Saga } from "redux-saga";
import { Reducer } from "redux";
import { ReducerMap } from "./createReducer";
import { ActionMap, ActionPattern } from "./createAction";
declare type HiveConfig<S = any> = {
    name: string;
    initialState: S;
    reducers: ReducerMap<S>;
    reducerBuilder?: (builder: ReducerBuilder<S>) => void;
    sagas?: Saga[];
};
export interface Hive<S = any> {
    name: string;
    reducer: Reducer<S>;
    actions: ActionMap;
    saga?: Saga;
}
export interface ReducerBuilder<S> {
    add(pattern: ActionPattern, reducer: Reducer<S>): void;
}
export declare function createHive<S>({ name, initialState, reducers, reducerBuilder, sagas, }: HiveConfig<S>): Hive<S>;
export {};
