import { Json } from "./json.type";

export interface ITransformer<T, S, E = void> {

    readJson<T>(defaultInstance: T, json: Json<T>, extra?: E): T;

    writeJson<T>(defaultJson: Json<T>, instance: Json<T>, extra?: E): Json<T>;
}
