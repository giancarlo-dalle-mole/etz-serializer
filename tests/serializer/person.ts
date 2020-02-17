import { Serializable, Serialize } from "../../src/decorators";

@Serializable({name: "Person", namespace: "HumanResources", version: 1})
export class Person {

    @Serialize()
    public firstName: string;

    @Serialize()
    public lastName: string;

    @Serialize({groups: ["details"]})
    public father: Person;

    @Serialize({groups: ["details"]})
    public mother: Person;
}
