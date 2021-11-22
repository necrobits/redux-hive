import { Reducer } from "redux";
import { createReducer, ReducerMap } from "./createReducer";


type HiveConfig<S> = {
    initialState: S;
    reducers: ReducerMap<S>;
    name: string;
    addons?: any[];
    sagas?: any[];
};

export interface Hive<S> {
    reducer: Reducer<S>;
    name: string;
}

let a = createHive<any>({
    name: 'test',
    initialState: {
        a: 1,
        b: 2,
    },
    reducers: {},
    addons: [],
});

export function createHive<S>({
    initialState,
    reducers,
    name
}: HiveConfig<S>): Hive<S> {
    const reducer = createReducer<S>({ initialState, reducers });
    return {
        name: name,
        reducer: reducer,
    }
};