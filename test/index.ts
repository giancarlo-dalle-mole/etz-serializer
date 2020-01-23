import "reflect-metadata";

import { Json, SerializerRegistry } from "../src";
import { ISerializable } from "../src/public/common/serializable.interface";

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

let types = SerializerRegistry.getTypes();


