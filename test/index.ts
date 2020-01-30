import "reflect-metadata";

import {
    ISerializable, Json, Serialize, Serializable, SerializerRegistry, Serializer
} from "../src";
import { JsonWriter } from "../src/services/json-writer";

class A {

    public name: string;
}

class B implements ISerializable<B> {

    public name: string;

    public birthDate: Date;

    public readJson<T>(json: Json<T>): void {
        return undefined;
    }

    public writeJson(serializerOutput: JsonWriter<B>): void {
    }
}

class C {

    public width: number;

    public height: number;

    public b: B;
}

SerializerRegistry.addType(
    A,
    [
        {
            name: "name",
            type: () => String
        }
    ]
);

SerializerRegistry.addType(
    B,
    [
        {
            name: "name",
            type: () => String,
            groups: ["save"]
        }
    ],
    {
        namespace: "Financial",
        name: "BCustom",
        version: 2
    }
);

SerializerRegistry.addType(
    C,
    [
        {
            name: "width",
            type: () => Number
        },
        {
            name: "height",
            type: () => Number
        },
        {
            name: "b",
            type: () => B
        }
    ],
    {
        namespace: "Financial.Orders",
        name: "C"
    }
);

@Serializable()
abstract class Person implements ISerializable<Person> {

    @Serialize()
    public phone: string;

    public notMarkedButAdded: string;

    public readJson(json: Json<Person>): void {
        return undefined;
    }

    public writeJson(serializerOutput: JsonWriter<Person>): void {

        serializerOutput.defaultWriteJson();
        serializerOutput.json.notMarkedButAdded = "this is custom";
    }
}

class NonSerializable extends Person {

    public thisWillNotSerialize: string;
}

@Serializable()
class PhysicalPerson extends NonSerializable {

    @Serialize()
    public firstName: string;

    @Serialize()
    public middleName: string;

    @Serialize({extra: {isWrapper: true}})
    public lastName: String;
}

const serializer: Serializer = new Serializer();

const a: A = new A();
a.name = "Elizabeth Dummont";

const as: Array<A> = [];
for (let i: number = 1; i <= 3; i++) {

    const a: A = new A();
    a.name = `Name number ${i}`;
    as.push(a);
}

const elizabeth: PhysicalPerson = new PhysicalPerson();
elizabeth.firstName = "Elizabeth";
elizabeth.lastName = new String("Dummont");
elizabeth.phone = "32323232";
elizabeth.thisWillNotSerialize = "this will not serialize";

// const aJson: Json<A> = serializer.toJson<A>(a);
const elizabethJson: Json<PhysicalPerson> = serializer.toJson<PhysicalPerson>(elizabeth);
console.log();
