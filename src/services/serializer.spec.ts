import { expect } from "chai";
import "mocha";

import {
    A, B, Bar, Baz, Foo, NonSerializableClass, Other, Person, Point2D
} from "../../tests/serializer";
import { Point3D } from "../../tests/serializer/point-3d";
import { Pointer } from "../../tests/serializer/pointer";

import { Json } from "../common";
import { BehaviorEnum } from "../enums";
import {
    ArrayDimensionsOutOfRangeException, NotAssignableException, NotSerializableException
} from "../exceptions";
import { ArrayDimensionsEnum } from "../transformers";
import { Serializer } from "./serializer";

describe("Serializer", () => {

    describe("Simple operations", () => {

        let serializer: Serializer;

        before(() => {

            serializer = new Serializer();
        });

        it("To Json", () => {

            const point2D: Point2D = new Point2D();
            point2D.x = 10;
            point2D.y = 12;

            const point2DJson: Json<Point2D> = serializer.toJson(point2D);

            expect(point2DJson).to.deep.equal({
                x: 10,
                y: 12,
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["Points.Point2D", 1]
                    ],
                    objectMetadata: undefined
                }
            } as Json<Point2D>);
        });

        it("From Json", () => {

            const point2DJson: Json<Point2D> = {
                x: 10,
                y: 12,
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["Points.Point2D", 1]
                    ],
                    objectMetadata: undefined
                }
            };

            const point2D: Point2D = new Point2D();
            point2D.x = 10;
            point2D.y = 12;

            const point2DRestored: Point2D = serializer.fromJson(point2DJson);

            expect(point2DRestored).to.instanceOf(Point2D);
            expect(point2DRestored.constructor).to.equal(Point2D);
            expect(point2DRestored).to.deep.equal(point2D);
        });

        it("To Json with non serializable object", () => {

            const other: Other = new Other();
            other.aNumber = 10;
            other.aString = "Delta";
            other.aNonSerializableClass = new NonSerializableClass();
            other.aNonSerializableClass.anotherNumber = 2;
            other.aNonSerializableClass.anotherString = "Foxtrot";
            other.aNonSerializableClass.aDate = new Date("2020-03-06T20:39:55.097Z");

            const toJson = serializer.toJson.bind(serializer, other as any);

            expect(toJson).to.throw(NotSerializableException);
        });

        it("From Json with non serializable object", () => {

            // This situation should not happen in a normal situation, but it is possible and should
            // throw an error

            const otherJson: Json<Other> = {
                aNumber: 10,
                aString: "Delta",
                aNonSerializableClass:  {
                    anotherNumber: 2,
                    anotherString: "Foxtrot",
                    aDate: "2020-03-06T20:39:55.097Z"
                }
            };

            const fromJson = serializer.fromJson.bind(serializer, otherJson as any, Other);

            expect(fromJson).to.throw(NotSerializableException);
        });

        it("To Json Array", () => {

            const point2D1: Point2D = new Point2D();
            point2D1.x = 10;
            point2D1.y = 12;

            const point2D2: Point2D = new Point2D();
            point2D2.x = 1;
            point2D2.y = 7;

            const point2D3: Point2D = new Point2D();
            point2D3.x = 252;
            point2D3.y = -5;

            const point2DArray: Array<Point2D> = [point2D1, point2D2, point2D3];

            const point2DArrayJson: Array<Json<Point2D>> = serializer.toJson(point2DArray);

            expect(point2DArrayJson).to.deep.equal(
                [
                    {
                        x: 10,
                        y: 12,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 1,
                        y: 7,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 252,
                        y: -5,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    }
                ] as Array<Json<Point2D>>
            );
        });

        it("From Json Array", () => {

            const point2DArrayJson: Array<Json<Point2D>> = [
                {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                {
                    x: 1,
                    y: 7,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                {
                    x: 252,
                    y: -5,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                }
            ];

            const point2DArrayRestored: Array<Point2D> = serializer.fromJson(point2DArrayJson);

            const point2D1: Point2D = new Point2D();
            point2D1.x = 10;
            point2D1.y = 12;

            const point2D2: Point2D = new Point2D();
            point2D2.x = 1;
            point2D2.y = 7;

            const point2D3: Point2D = new Point2D();
            point2D3.x = 252;
            point2D3.y = -5;

            const point2DArray: Array<Point2D> = [point2D1, point2D2, point2D3];

            expect(point2DArrayRestored).to.instanceOf(Array);
            expect(point2DArrayRestored[0].constructor).to.equal(Point2D);
            expect(point2DArrayRestored[1].constructor).to.equal(Point2D);
            expect(point2DArrayRestored[2].constructor).to.equal(Point2D);
            expect(point2DArrayRestored).to.deep.equal(point2DArray);
        });

        it("To Json - login group", () => {

            const elizabeth: Person = new Person();
            elizabeth.firstName = "Elizabeth";
            elizabeth.lastName = "Keen";

            const katarina: Person = new Person();
            katarina.firstName = "Katarina";
            katarina.lastName = "Rostova";

            const raymond: Person = new Person();
            raymond.firstName = "Raymond";
            raymond.lastName = "Reddington";

            elizabeth.mother = katarina;
            elizabeth.father = raymond;

            const elizabethLogin: Json<Person> = serializer.toJson(elizabeth, {groups: ["login"]});

            expect(elizabethLogin).to.deep.equal({
                firstName: "Elizabeth",
                lastName: "Keen",
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["HumanResources.Person", 1]
                    ],
                    objectMetadata: undefined
                }
            } as Json<Person>);
        });

        it("From Json - login group", () => {

            const elizabethLoginJson: Json<Person> = {
                firstName: "Elizabeth",
                lastName: "Keen",
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["HumanResources.Person", 1]
                    ],
                    objectMetadata: undefined
                }
            };

            const elizabethLogin: Person = new Person();
            elizabethLogin.firstName = "Elizabeth";
            elizabethLogin.lastName = "Keen";

            const elizabethLoginRestored: Person = serializer.fromJson(elizabethLoginJson, null, {groups: ["login"]});

            expect(elizabethLoginRestored).to.deep.equal(elizabethLogin);
        });

        it("From Json - login group with extra", () => {

            const elizabethLoginJson: Json<Person> = {
                firstName: "Elizabeth",
                lastName: "Keen",
                mother: {
                    firstName: "Katarina",
                    lastName: "Rostova",
                    father: undefined,
                    mother: undefined,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["HumanResources.Person", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                father: {
                    firstName: "Raymond",
                    lastName: "Reddington",
                    father: undefined,
                    mother: undefined,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["HumanResources.Person", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["HumanResources.Person", 1]
                    ],
                    objectMetadata: undefined
                }
            };

            const elizabethLogin: Person = new Person();
            elizabethLogin.firstName = "Elizabeth";
            elizabethLogin.lastName = "Keen";

            const elizabethLoginRestored: Person = serializer.fromJson(elizabethLoginJson, null, {groups: ["login"]});

            expect(elizabethLoginRestored).to.deep.equal(elizabethLogin);
        });

        it("To Json - details group", () => {

            const elizabethDetails: Person = new Person();
            elizabethDetails.firstName = "Elizabeth";
            elizabethDetails.lastName = "Keen";

            const katarina: Person = new Person();
            katarina.firstName = "Katarina";
            katarina.lastName = "Rostova";

            const raymond: Person = new Person();
            raymond.firstName = "Raymond";
            raymond.lastName = "Reddington";

            elizabethDetails.mother = katarina;
            elizabethDetails.father = raymond;

            const elizabethDetailsJson: Json<Person> = serializer.toJson(elizabethDetails, {groups: ["details"]});

            expect(elizabethDetailsJson).to.deep.equal({
                firstName: "Elizabeth",
                lastName: "Keen",
                mother: {
                    firstName: "Katarina",
                    lastName: "Rostova",
                    father: undefined,
                    mother: undefined,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["HumanResources.Person", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                father: {
                    firstName: "Raymond",
                    lastName: "Reddington",
                    father: undefined,
                    mother: undefined,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["HumanResources.Person", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["HumanResources.Person", 1]
                    ],
                    objectMetadata: undefined
                }
            } as Json<Person>);
        });

        it("From Json - details group", () => {

            const elizabethDetailsJson: Json<Person> = {
                firstName: "Elizabeth",
                lastName: "Keen",
                mother: {
                    firstName: "Katarina",
                    lastName: "Rostova",
                    father: undefined,
                    mother: undefined,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["HumanResources.Person", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                father: {
                    firstName: "Raymond",
                    lastName: "Reddington",
                    father: undefined,
                    mother: undefined,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["HumanResources.Person", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [
                        ["HumanResources.Person", 1]
                    ],
                    objectMetadata: undefined
                }
            };

            const elizabethDetails: Person = new Person();
            elizabethDetails.firstName = "Elizabeth";
            elizabethDetails.lastName = "Keen";

            const katarina: Person = new Person();
            katarina.firstName = "Katarina";
            katarina.lastName = "Rostova";
            // Necessary, in future ES spec, declared class fields will initialize with undefined
            katarina.mother  = undefined;
            katarina.father = undefined;

            const raymond: Person = new Person();
            raymond.firstName = "Raymond";
            raymond.lastName = "Reddington";
            // Necessary, in future ES spec, declared class fields will initialize with undefined
            raymond.mother  = undefined;
            raymond.father = undefined;

            elizabethDetails.mother = katarina;
            elizabethDetails.father = raymond;

            const elizabethDetailsRestored: Person = serializer.fromJson(elizabethDetailsJson, null, {groups: ["details"]});

            expect(elizabethDetailsRestored).to.deep.equal(elizabethDetails);
        });

        it("To Json inheritance", () => {

            const point3D: Point3D = new Point3D();
            point3D.x = 10;
            point3D.y = 12;
            point3D.z = 3;

            const point3dJson: Json<Point3D> = serializer.toJson(point3D);

            expect(point3dJson).to.deep.equal({
                x: 10,
                y: 12,
                z: 3,
                "__enterprize:serializer:metadata": {
                    versions: [["Points.Point2D", 1], ["Points.Point3D", 1]],
                    objectMetadata: undefined
                }
            } as Json<Point3D>);
        });

        it("From Json inheritance OK", () => {

            // This test shows that with typeMetadata enabled, the serializer can restore an object
            // to its original prototype even if a super class is informed

            const point3dJson: Json<Point3D> = {
                x: 10,
                y: 12,
                z: 3,
                "__enterprize:serializer:metadata": {
                    versions: [["Points.Point2D", 1], ["Points.Point3D", 1]],
                    objectMetadata: undefined
                }
            };

            const point2dRestored: Point2D = serializer.fromJson(point3dJson, Point2D, {typeCheck: true});

            const point3d: Point3D = new Point3D();
            point3d.x = 10;
            point3d.y = 12;
            point3d.z = 3;

            expect(point2dRestored).to.deep.equal(point3d);
            expect(point2dRestored).to.instanceOf(Point3D);
            expect(point2dRestored.constructor).to.equal(Point3D);
        });

        it("From Json inheritance NOT OK - throws exception", () => {

            const point2dJson: Json<Point2D> = {
                x: 10,
                y: 12,
                "__enterprize:serializer:metadata": {
                    versions: [["Points.Point2D", 1]],
                    objectMetadata: undefined
                }
            };

            const fromJson = serializer.fromJson.bind(serializer, point2dJson as any, Point3D, {typeCheck: true});

            expect(fromJson).to.throw(NotAssignableException);
        });

        it("From Json inheritance NOT OK but type check false", () => {

            const point2dJson: Json<Point2D> = {
                x: 10,
                y: 12,
                "__enterprize:serializer:metadata": {
                    versions: [["Points.Point2D", 1]],
                    objectMetadata: undefined
                }
            };
            // Actually will be a Point2D and its assign is incorrect, never disable typeCheck unless you
            // really know what you are doing
            const point3dRestored: Point3D = serializer.fromJson(point2dJson, Point3D, {typeCheck: false});

            const point2d: Point2D = new Point2D();
            point2d.x = 10;
            point2d.y = 12;

            expect(point3dRestored).to.deep.equal(point2d);
            expect(point3dRestored).to.instanceOf(Point2D);
            expect(point3dRestored.constructor).to.equal(Point2D);
        });

        it("From Json not inheritance NOT OK inside object", () => {

            const pointerJson: Json<Pointer> = {
                point2D: {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [["Points.Point2D", 1]],
                        objectMetadata: undefined
                    }
                },
                point3D: {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [["Points.Point2D", 1]], // this says the object is a Point2D, which is not assignable to a Point3D
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [["Points.Pointer", 1]],
                    objectMetadata: undefined
                }
            };

            const fromJson = serializer.fromJson.bind(serializer, pointerJson as any, Pointer, {typeCheck: true});

            expect(fromJson).to.throw(NotAssignableException);
        });
    });

    describe("Complex operations", () => {

        let serializer: Serializer;

        before(() => {

            serializer = new Serializer();
        });

        it("To Json duplicate object", () => {

            const foo: Foo = new Foo();
            foo.fooValue = 10;

            const bar: Bar = new Bar();
            bar.barValue = 21;
            bar.foo = foo;

            const baz: Baz = new Baz();
            baz.foo = foo;
            baz.bar = bar;

            const bazJson: Json<Baz> = serializer.toJson(baz);

            expect(bazJson).to.deep.equal({
                foo: {
                    fooValue: 10,
                    "__enterprize:serializer:metadata": {
                        versions: [["Foos.Foo", 1]],
                        objectMetadata: undefined
                    }
                },
                bar: {
                    barValue: 21,
                    foo: {$ref: "#/foo"},
                    "__enterprize:serializer:metadata": {
                        versions: [["Foos.Bar", 1]],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [["Foos.Baz", 1]],
                    objectMetadata: undefined
                }
            });
        });

        it("From Json duplicate object ($ref pointer)", () => {

            const bazJson: any = {
                foo: {
                    fooValue: 10,
                    "__enterprize:serializer:metadata": {
                        versions: [["Foos.Foo", 1]],
                        objectMetadata: undefined
                    }
                },
                bar: {
                    barValue: 21,
                    foo: {$ref: "#/foo"},
                    "__enterprize:serializer:metadata": {
                        versions: [["Foos.Bar", 1]],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [["Foos.Baz", 1]],
                    objectMetadata: undefined
                }
            };

            const bazRestored: Baz = serializer.fromJson(bazJson);

            const foo: Foo = new Foo();
            foo.fooValue = 10;

            const bar: Bar = new Bar();
            bar.barValue = 21;
            bar.foo = foo;

            const baz: Baz = new Baz();
            baz.foo = foo;
            baz.bar = bar;

            expect(bazRestored).to.deep.equal(baz);
            expect(bazRestored.foo).to.equal(bazRestored.bar.foo, "Objects references are not equal.");
        });

        it("To Json circular references", () => {

            const a: A = new A();
            const b: B = new B();

            a.b = b;
            b.a = a;

            const aJson: Json<A> = serializer.toJson(a);

            expect(aJson).to.deep.equal({
                b: {
                    a: {$ref: "#"},
                    "__enterprize:serializer:metadata": {
                        versions: [["Alphabet.B", 1]],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [["Alphabet.A", 1]],
                    objectMetadata: undefined
                }
            });
        });

        it("From Json circular references", () => {

            const aJson: any = {
                b: {
                    a: {$ref: "#"},
                    "__enterprize:serializer:metadata": {
                        versions: [["Alphabet.B", 1]],
                        objectMetadata: undefined
                    }
                },
                "__enterprize:serializer:metadata": {
                    versions: [["Alphabet.A", 1]],
                    objectMetadata: undefined
                }
            };


            const aRestored: Json<A> = serializer.fromJson(aJson);

            const a: A = new A();
            const b: B = new B();

            a.b = b;
            b.a = a;

            expect(aRestored).to.deep.equal(a);
            expect(a.b.a).to.equal(a, "a.b.a is not the same ref as root object a");
        });

        it("To Json Array Duplicate Objects", () => {

            const point2D: Point2D = new Point2D();
            point2D.x = 10;
            point2D.y = 12;

            const point2DArray: Array<Point2D> = [point2D, point2D, point2D];

            const point2DArrayJson: Array<Json<Point2D>> = serializer.toJson(point2DArray);

            expect(point2DArrayJson).to.deep.equal(
                [
                    {
                        x: 10,
                        y: 12,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        $ref: "#/0"
                    },
                    {
                        $ref: "#/0"
                    }
                ]
            );
        });

        it("To From Json Array Duplicate Objects", () => {

            const point2DArrayJson: Array<Json<Point2D>> = [
                {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                {
                    $ref: "#/0"
                },
                {
                    $ref: "#/0"
                }
            ];

            const point2DRestoredArray: Array<Point2D> = serializer.fromJson(point2DArrayJson);

            const point2D: Point2D = new Point2D();
            point2D.x = 10;
            point2D.y = 12;

            const point2DArray: Array<Point2D> = [point2D, point2D, point2D];

            expect(point2DRestoredArray).to.deep.equal(point2DArray);
            expect(point2DRestoredArray[1]).to.equal(point2DRestoredArray[0]);
            expect(point2DRestoredArray[2]).to.equal(point2DRestoredArray[0]);
        });
    });

    describe("Type Checks", () => {

        let serializer: Serializer;

        before(() => {

            serializer = new Serializer();
        });

        it("Array out of dimensions - more dimensions", () => {

            const point2DMatrixJson: Array<Array<Json<Point2D>>> = [
                [
                    {
                        x: 10,
                        y: 12,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 1,
                        y: 7,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 9,
                        y: 125,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    }
                ],
                [
                    {
                        x: 36,
                        y: -8,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 32,
                        y: -8,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 1254,
                        y: -254,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    }
                ],
                [
                    {
                        x: -10,
                        y: -12,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: -1,
                        y: 0,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: -2,
                        y: 5,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    }
                ]
            ];

            const fromJson = serializer.fromJson.bind(serializer, point2DMatrixJson as any, Array, {typeCheck: true}, {itemType: () => Point2D, dimensions: ArrayDimensionsEnum.ONE_DIMENSIONAL});

            expect(fromJson)
                .to.throw(ArrayDimensionsOutOfRangeException);
        });

        it("Array out of dimensions - less dimensions", () => {

            const point2DArrayJson: Array<Json<Point2D>> = [
                {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                {
                    x: 1,
                    y: 7,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                {
                    x: 9,
                    y: 125,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                }
            ];

            const fromJson = serializer.fromJson.bind(serializer, point2DArrayJson as any, Array, {typeCheck: true}, {itemType: () => Point2D, dimensions: ArrayDimensionsEnum.TWO_DIMENSIONAL});

            expect(fromJson)
                .to.throw(ArrayDimensionsOutOfRangeException);
        });

        it("Array out of dimensions - item with more dimensions", () => {

            const point2DArrayTuple: [Json<Point2D>, Array<Json<Point2D>>] = [
                {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
                [
                    {
                        x: 36,
                        y: -8,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 32,
                        y: -8,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 1254,
                        y: -254,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    }
                ]
            ];

            const fromJson = serializer.fromJson.bind(serializer, point2DArrayTuple as any, Array, {typeCheck: true}, {itemType: () => Point2D, dimensions: ArrayDimensionsEnum.ONE_DIMENSIONAL});

            expect(fromJson)
                .to.throw(ArrayDimensionsOutOfRangeException);
        });

        it("Array out of dimensions - item with less dimensions", () => {

            const point2DArrayTuple: [Array<Json<Point2D>>, Json<Point2D>] = [
                [
                    {
                        x: 36,
                        y: -8,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 32,
                        y: -8,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    },
                    {
                        x: 1254,
                        y: -254,
                        "__enterprize:serializer:metadata": {
                            versions: [
                                ["Points.Point2D", 1]
                            ],
                            objectMetadata: undefined
                        }
                    }
                ],
                {
                    x: 10,
                    y: 12,
                    "__enterprize:serializer:metadata": {
                        versions: [
                            ["Points.Point2D", 1]
                        ],
                        objectMetadata: undefined
                    }
                },
            ];

            const fromJson = serializer.fromJson.bind(serializer, point2DArrayTuple as any, Array, {typeCheck: true}, {itemType: () => Point2D, dimensions: ArrayDimensionsEnum.TWO_DIMENSIONAL});

            expect(fromJson)
                .to.throw(ArrayDimensionsOutOfRangeException);
        });
    });

    describe("Operations without type metadata", () => {

        let serializer: Serializer;

        before(() => {

            serializer = new Serializer({
                typeCheck: true,
                versionMismatchBehavior: BehaviorEnum.ERROR, // this option is irrelevant with typeMetadata disabled
                objectMetadata: true,
                typeMetadata: false
            });
        });

        it("To Json", () => {

            const point2D: Point2D = new Point2D();
            point2D.x = 10;
            point2D.y = 12;

            const point2DJson: Json<Point2D> = serializer.toJson(point2D);

            expect(point2DJson).to.deep.equal({
                x: 10,
                y: 12
            } as Json<Point2D>);
        });

        it("From Json", () => {

            const point2DJson: Json<Point2D> = {
                x: 10,
                y: 12
            };

            const point2D: Point2D = new Point2D();
            point2D.x = 10;
            point2D.y = 12;

            const point2DRestored: Point2D = serializer.fromJson(point2DJson, Point2D);

            expect(point2DRestored).to.instanceOf(Point2D);
            expect(point2DRestored.constructor).to.equal(Point2D);
            expect(point2DRestored).to.deep.equal(point2D);
        });

        it("To Json Array", () => {

            const point2D1: Point2D = new Point2D();
            point2D1.x = 10;
            point2D1.y = 12;

            const point2D2: Point2D = new Point2D();
            point2D2.x = 1;
            point2D2.y = 7;

            const point2D3: Point2D = new Point2D();
            point2D3.x = 252;
            point2D3.y = -5;

            const point2DArray: Array<Point2D> = [point2D1, point2D2, point2D3];

            const point2DArrayJson: Array<Json<Point2D>> = serializer.toJson(point2DArray);

            expect(point2DArrayJson).to.deep.equal(
                [
                    {
                        x: 10,
                        y: 12
                    },
                    {
                        x: 1,
                        y: 7
                    },
                    {
                        x: 252,
                        y: -5
                    }
                ] as Array<Json<Point2D>>
            );
        });

        it("From Json Array", () => {

            const point2DArrayJson: Array<Json<Point2D>> = [
                {
                    x: 10,
                    y: 12
                },
                {
                    x: 1,
                    y: 7
                },
                {
                    x: 252,
                    y: -5
                }
            ];

            const point2DArrayRestored: Array<Point2D> = serializer.fromJson(
                point2DArrayJson,
                Array,
                null,
                {
                    itemType: () => Point2D,
                    dimensions: ArrayDimensionsEnum.ONE_DIMENSIONAL
                }
            );

            const point2D1: Point2D = new Point2D();
            point2D1.x = 10;
            point2D1.y = 12;

            const point2D2: Point2D = new Point2D();
            point2D2.x = 1;
            point2D2.y = 7;

            const point2D3: Point2D = new Point2D();
            point2D3.x = 252;
            point2D3.y = -5;

            const point2DArray: Array<Point2D> = [point2D1, point2D2, point2D3];

            expect(point2DArrayRestored instanceof Array).to.true;
            expect(point2DArrayRestored[0].constructor).to.equal(Point2D);
            expect(point2DArrayRestored[1].constructor).to.equal(Point2D);
            expect(point2DArrayRestored[2].constructor).to.equal(Point2D);
            expect(point2DArrayRestored).to.deep.equal(point2DArray);
        });

        it("From Json inheritance OK", () => {

            // In this case, since typeMetadata is disabled, we cannot restore it to Point3D if Point2D
            // os set as expectedType

            const point3d: Point3D = new Point3D();
            point3d.x = 10;
            point3d.y = 12;
            point3d.z = 3;

            const point3dJson: Json<Point3D> = serializer.toJson(point3d);
            const point2dRestored: Point2D = serializer.fromJson(point3dJson, Point2D);

            const point2d: Point2D = new Point2D();
            point2d.x = 10;
            point2d.y = 12;

            expect(point2dRestored).to.deep.equal(point2d);
            expect(point2dRestored).to.instanceOf(Point2D);
            expect(point2dRestored.constructor).to.equal(Point2D);
        });

        it("From Json inheritance NOT OK", () => {

            // This test MUST pass because the serializer does not know that the passed json is actually
            // a Point2D json instead of a Point3D json. It assumes the json belongs to a Point3D and
            // the missing attributes are actually "undefined".

            const point2d: Point2D = new Point2D();
            point2d.x = 10;
            point2d.y = 12;

            const point2dJson: Json<Point2D> = serializer.toJson(point2d);
            const point3dRestored: Point3D = serializer.fromJson(point2dJson, Point3D);

            const point3d: Point3D = new Point3D();
            point3d.x = 10;
            point3d.y = 12;
            point3d.z = undefined; // All classes attributes are set to undefined if not present in json

            expect(point3dRestored).to.deep.equal(point3d);
            expect(point3dRestored).to.instanceOf(Point3D);
            expect(point3dRestored.constructor).to.equal(Point3D);
        });
    });

    describe("Performance tests", () => {

    });
});

