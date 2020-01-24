import "reflect-metadata";

import { Json, metadataKeys, SerializerRegistry } from "../src";
import { ISerializable } from "../src/common/serializable.interface";
import { Serializable } from "../src/decorators";
import { Serialize } from "../src/decorators/serialize.decorator";

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


@Serializable()
class PhysicalPerson extends Person {

    @Serialize()
    public firstName: string;

    @Serialize()
    public middleName: string;

    @Serialize()
    public lastName: string;
}

let types = SerializerRegistry.getTypes();
let transformers = SerializerRegistry.getTransformers();
const sm = Reflect.getOwnMetadata(metadataKeys.serializable, PhysicalPerson);
const sm2 = Reflect.getOwnMetadata(metadataKeys.serializable, Person);
