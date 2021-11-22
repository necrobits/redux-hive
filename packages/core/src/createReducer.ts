
import { Draft, produce } from 'immer';
import _ from 'lodash';
import { Action } from './createAction';
import { AnyAction } from 'redux';

export type Reducer<S=any, A extends Action = AnyAction> = (state: S, action?: A) => S;
export type StateModifier<S=any, A extends Action<any>=Action<any>> = (state: S, action?: A) => void;
export type ReducerOrModifier<S> =  Reducer<S> | StateModifier<S>
export type ReducerMap<S> = { [actionType: string]: ReducerOrModifier<S> };
type ReducerConfig<S> = {
    initialState: S;
    reducers: ReducerMap<S>;
    usingImmer?: boolean;
}

export function createReducer<S>({
    initialState,
    reducers,
    usingImmer = true,
}: ReducerConfig<S>): Reducer<S> {

    return (state: S = initialState, action: Action): S => {
        if (!_.has(reducers, action.type)) {
            return state;
        }
        const reducer = reducers[action.type];
        if (!usingImmer) {
            return reducer(state, action)!;
        }
        const nextState = produce(state, (draft: Draft<S>) => {
            reducer(draft as S, action);
        });
        if (!nextState){
            return state;
        }
        return state;
    }
}