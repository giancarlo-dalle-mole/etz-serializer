import "reflect-metadata";

import {
    ISerializable, Json, metadataKeys, Serialize, Serializable, SerializerRegistry, Serializer
} from "../src";

class A {

    public name: string;
}

class B implements ISerializable {

    public name: string;

    public birthDate: Date;

    public readJson<T>(defaultInstance: T, json: Json<T>): T {
        return undefined;
    }

    public writeJson<T>(defaultJson: Json<T>, instance: T): Json<T> {
        return undefined;
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
        version: 2,
        defaultStrategy: false
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
abstract class Person {

    @Serialize()
    public phone: string;
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

    @Serialize()
    public lastName: string;
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
elizabeth.lastName = "Dummont";
elizabeth.phone = "32323232";
elizabeth.thisWillNotSerialize = "this will not serialize";

const aJson: Json<A> = serializer.toJson<A>(a);
const elizabethJson: Json<PhysicalPerson> = serializer.toJson<PhysicalPerson>(elizabeth);

