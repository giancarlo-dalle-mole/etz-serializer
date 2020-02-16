import { Serializable, Serialize } from "../src/decorators";
import { B } from "./b.spec";

@Serializable({name: "A", namespace: "Alphabet", version: 1})
export class A {

    @Serialize(() => B)
    public b: B;
}
