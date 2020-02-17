import { Serializable, Serialize } from "../../src/decorators";
import { Bar } from "./bar";
import { Foo } from "./foo";

@Serializable({name: "Baz", namespace: "Foos", version: 1})
export class Baz {

    @Serialize(() => Foo)
    public foo: Foo;

    @Serialize(() => Bar)
    public bar: Bar;
}
