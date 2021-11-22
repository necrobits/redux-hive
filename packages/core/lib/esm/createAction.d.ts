export declare type Action<T = any> = {
    type: string;
    payload?: T;
};
export declare type ActionPattern = string | ActionCreator;
export declare type PayloadFn<T = any> = (...args: any) => T;
export interface ActionCreator<T = any> {
    type: string;
    (...args: any): Action<T>;
}
export declare type ActionMap = {
    [actionType: string]: ActionCreator;
};
export declare function createAction<T>(name: string, payloadOrPayloadFn: T | PayloadFn<T>): ActionCreator<T>;
