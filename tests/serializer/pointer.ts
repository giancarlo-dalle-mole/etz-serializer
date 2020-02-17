import { Serializable } from "../../src/decorators";
import { Serialize } from "../../src/decorators";
import { Point2D } from "./point-2d";
import { Point3D } from "./point-3d";

@Serializable({name: "Pointer", namespace: "Points", version: 1})
export class Pointer {

    @Serialize()
    public point2D: Point2D;

    @Serialize()
    public point3D: Point3D;
}
