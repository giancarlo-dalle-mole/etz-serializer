import { Serializable, Serialize } from "../../src/decorators";
import { Foo } from "./foo";

@Serializable({name: "Bar", namespace: "Foos", version: 1})
export class Bar {

    @Serialize()
    public barValue: number;

    @Serialize(() => Foo)
    public foo: Foo;
}
