import "mocha";
import { expect } from "chai";
import { A } from "../../tests/a.spec";
import { B } from "../../tests/b.spec";

import { Json } from "../common";
import { Serializable, Serialize } from "../decorators";
import { JsonMetadata } from "../common";
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
            });
        });

        it("From Json", () => {

            const point2DJson: Json<Point2D> & { "__enterprize:serializer:metadata": JsonMetadata } = {
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

            expect(point2DRestored instanceof Point2D).to.true;
            expect(point2DRestored.constructor === Point2D).to.true;
            expect(point2DRestored).to.deep.equal(point2D);
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
    });

    describe("Performance tests", () => {

    });
});

@Serializable({name: "Point2D", namespace: "Points", version: 1})
class Point2D {

    @Serialize()
    public x: number;

    @Serialize()
    public y: number;
}

@Serializable({name: "Foo", namespace: "Foos", version: 1})
class Foo {

    @Serialize()
    public fooValue: number;
}

@Serializable({name: "Bar", namespace: "Foos", version: 1})
class Bar {

    @Serialize()
    public barValue: number;

    @Serialize(() => Foo)
    public foo: Foo;
}

@Serializable({name: "Baz", namespace: "Foos", version: 1})
class Baz {

    @Serialize(() => Foo)
    public foo: Foo;

    @Serialize(() => Bar)
    public bar: Bar;
}



class Person {

    firstName: string;

    lastName: string;

    father: Person;

    mother: Person;
}
