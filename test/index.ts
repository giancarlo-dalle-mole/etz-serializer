import "reflect-metadata";

import { ArrayDimensionsEnum, Json, Serializable, Serialize, Serializer } from "../src";

const serializer: Serializer = new Serializer();

@Serializable()
class Person {

    @Serialize()
    public firstName: string;

    @Serialize()
    public middleName: string;

    @Serialize()
    public lastName: string;

    @Serialize()
    public weight: number;

    @Serialize()
    public height: number;

    @Serialize()
    public birthDate: Date;

    constructor(firstName?: string, middleName?: string, lastName?: string, weight?: number,
                height?: number, birthDate?: Date) {

        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.weight = weight;
        this.height = height;
        this.birthDate = birthDate;
    }
}

const elizabeth: Person = new Person("Elizabeth", null, "Warren", 65000, 172);
const ana: Person = new Person("Ana", "Seara", "Von Klotoffen", 52000, 161);
const johnDoe: Person = new Person("John", null, "Doe", 85000, 185);

const people: Array<Person> = [elizabeth, ana, johnDoe];
const peopleJson: Array<Json<Person>> = serializer.toJson(people);
const peopleRestored: Array<Person> = serializer.fromJson(peopleJson, Array, null, {itemType: () => Person, dimensions: ArrayDimensionsEnum.ONE_DIMENSIONAL});

@Serializable({name: "Point2D", namespace: "Points", version: 1})
export class Point2D {

    @Serialize()
    public x: number;

    @Serialize()
    public y: number;

    constructor();
    constructor(x: number, y: number);
    constructor(...args: []|[number, number]) {

        if (args.length === 2) {
            this.x = args[0];
            this.y = args[1];
        }
    }
}

@Serializable({name: "Point3D", namespace: "Points", version: 1})
class Point3D extends Point2D {

    @Serialize()
    public z: number;

    public constructor();
    public constructor(z: number, x: number, y: number);
    public constructor(...args: []|[number, number, number]) {

        if (args.length === 0) {
            super();
        }
        else {
            super(args[0], args[1]);
            this.z = args[2];
        }
    }
}

const points2DMatrix: Array<Array<Point2D>> = [];
for (let i: number = 0; i < 5; i++) {

    const points2D: Array<Point2D> = [];
    for (let k: number = 0; k < 3; k++) {
        const point: Point2D = new Point2D(i, k);
        points2D.push(point);
    }

    points2DMatrix.push(points2D);
}

const points2DMatrixJson: Array<Array<Json<Point2D>>> = serializer.toJson(points2DMatrix);
const points2DMatrixRestored: Array<Array<Point2D>> = serializer.fromJson(points2DMatrixJson, Array, null, {itemType: () => Point2D, dimensions: ArrayDimensionsEnum.TWO_DIMENSIONAL});


@Serializable({name: "Pointer", namespace: "Points", version: 1})
class Pointer {

    @Serialize({extra: {itemType: () => Point2D, dimensions: ArrayDimensionsEnum.TWO_DIMENSIONAL}})
    public points: Array<Array<Point2D>>;
}

const pointer: Pointer = new Pointer();
pointer.points = [];
for (let i: number = 0; i < 1000; i++) {
    const points: Array<Point2D> = [];
    // 2d
    if (i % 2 === 0) {
        for (let k: number = 1; k < 1001; k++) {
            // 2d
            if (k % 2 === 0) {
                const point: Point2D = new Point2D(i, k-1);
                points.push(point);
            }
            else {
                const point: Point3D = new Point3D(i, k-1, i + (k-1));
                points.push(point);
            }
        }
    }
    // 3d
    else {
        for (let k: number = 0; k < 1000; k++) {
            // 2d
            if (k % 2 === 0) {
                const point: Point2D = new Point2D(i, k);
                points.push(point);
            }
            else {
                const point: Point3D = new Point3D(i, k, i + k);
                points.push(point);
            }
        }
    }

    pointer.points.push(points);
}

let start: number;
let end: number;

console.log("---------- Serialized");
start = Date.now();
const serializedPointer: Json<Pointer> = serializer.toJson(pointer);
end = Date.now();
console.log("Serialization Time", end - start);
// console.log(JSON.stringify(serializedPointer, null, "  "));

console.log("---------- Deserialized");
start = Date.now();
const deserializedPointer: Pointer = serializer.fromJson(serializedPointer, Pointer);
end = Date.now();
console.log("Deserialization Time", end - start);

console.log("--- DONE ---");
