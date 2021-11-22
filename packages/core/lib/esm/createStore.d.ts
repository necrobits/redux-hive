import { Middleware, Store } from "redux";
import { Hive } from "./createHive";
export declare type HiveStoreConfig = {
    hives: Hive[];
    middlewares: Middleware[];
};
export default function ({ hives, middlewares, }: HiveStoreConfig): Store;
