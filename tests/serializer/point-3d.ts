import { Serializable, Serialize } from "../../src/decorators";
import { Point2D } from "./point-2d";

@Serializable({name: "Point3D", namespace: "Points", version: 1})
export class Point3D extends Point2D {

    @Serialize()
    public z: number;
}
