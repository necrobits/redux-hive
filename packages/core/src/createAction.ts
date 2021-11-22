import _ from "lodash";


export type Action<T = any> = {
    type: string,
    payload?: T
}
export type ActionPattern = string | ActionCreator;

export type PayloadFn<T=any> = (...args: any) => T;
export interface ActionCreator<T=any>{
    type: string;
    (...args: any): Action<T>;
}
export type ActionMap = { [actionType: string]: ActionCreator};

export function createAction<T>(name: string, payloadOrPayloadFn: T | PayloadFn<T>): ActionCreator<T> {
    const actionCreator = (...args: any): Action<T> => {
        let payload = payloadOrPayloadFn;
        if (_.isFunction(payloadOrPayloadFn)) {
            payload = payloadOrPayloadFn(...args);
        }
        return {
            type: name,
            payload: payload as T,
        };
    }
    actionCreator.type = name;
    return actionCreator;
}
