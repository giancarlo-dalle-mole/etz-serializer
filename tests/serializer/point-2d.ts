import { Serializable, Serialize } from "../../src/decorators";

@Serializable({name: "Point2D", namespace: "Points", version: 1})
export class Point2D {

    @Serialize()
    public x: number;

    @Serialize()
    public y: number;
}
