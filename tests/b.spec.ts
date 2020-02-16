import { Serializable, Serialize } from "../src/decorators";
import { A } from "./a.spec";

@Serializable({name: "B", namespace: "Alphabet", version: 1})
export class B {

    @Serialize(() => A)
    public a: A;
}
