import _ from "lodash";


export type Action<T = any> = {
    type: string,
    payload?: T
}

type PayloadFn<T> = (...args: any) => T;
type ActionFn<T> = (...args: any) => Action<T>;

export function createAction<T>(name: string, payloadOrPayloadFn: T | PayloadFn<T>): ActionFn<T> {
    return (...args: any): Action<T> => {
        let payload = payloadOrPayloadFn;
        if (_.isFunction(payloadOrPayloadFn)) {
            payload = payloadOrPayloadFn(...args);
        }
        return {
            type: name,
            payload: payload as T,
        };
    }
}