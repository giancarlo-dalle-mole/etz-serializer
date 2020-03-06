import { Serializable, Serialize } from "../../src/decorators";
import { NonSerializableClass } from "./non-serializable-class";

@Serializable({name: "Other", namespace: "Food", version: 1})
export class Other {

    @Serialize()
    public aNumber: number;

    @Serialize()
    public aString: string;

    @Serialize()
    public aNonSerializableClass: NonSerializableClass;
}
