import { Serializable, Serialize } from "../../src/decorators";

@Serializable({name: "Foo", namespace: "Foos", version: 1})
export class Foo {

    @Serialize()
    public fooValue: number;
}
