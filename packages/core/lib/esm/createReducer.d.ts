import type { Reducer } from 'redux';
export declare type ReducerMap<S> = {
    [actionType: string]: Reducer<S>;
};
declare type ReducerConfig<S> = {
    initialState: S;
    reducers: ReducerMap<S>;
    usingImmer?: boolean;
};
export declare function createReducer<S>({ initialState, reducers, usingImmer, }: ReducerConfig<S>): Reducer<S>;
export {};
