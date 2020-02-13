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

const point3d: Point3D = new Point3D(10, 12, 25);
const pont3dClone: Point3D = serializer.clone(point3d);


console.log("DONE");
