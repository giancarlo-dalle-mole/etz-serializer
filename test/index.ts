import "reflect-metadata";

import { Serializable, Serialize, Serializer } from "../src";

const serializer: Serializer = new Serializer();

@Serializable()
abstract class Person {

    @Serialize()
    public phone: string;
}


class NotSerializable extends Person {

    public aProperty: number;
}

@Serializable()
class PhysicalPerson extends NotSerializable {

    @Serialize()
    public firstName: string;

    @Serialize()
    public middleName: string;

    @Serialize()
    public lastName: string;
}

const pf: PhysicalPerson = new PhysicalPerson();
pf.firstName = "Elizabeth";
pf.lastName = "Warren";
pf.phone = "998788545";
pf.aProperty = 10;

const pfJson = serializer.toJson(pf);
console.log(pfJson);
const pfRestored = serializer.fromJson(pfJson);
console.log(pfRestored);
