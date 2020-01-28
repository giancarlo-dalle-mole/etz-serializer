import { Class, metadataKeys, SerializableField, SerializeOptions } from "../common";
import { TypesEnum } from "../enums";

export function Serialize<E = void>(): PropertyDecorator;
export function Serialize<E = void>(type: () => Class|TypesEnum): PropertyDecorator;
export function Serialize<E = void>(options: SerializeOptions<E>): PropertyDecorator;
export function Serialize<E = void>(type: () => Class|TypesEnum, options: SerializeOptions<E>): PropertyDecorator;
export function Serialize<E = void>(...args: []|[() => Class|TypesEnum]|[SerializeOptions<E>]|[() => Class|TypesEnum, SerializeOptions<E>]): PropertyDecorator {

    let type: () => Class|TypesEnum;
    let options: SerializeOptions<E>;

    if (args.length === 0) {
        type = null;
        options = {};
    }
    else if (args.length === 1) {

        if (typeof args[0] === "function") {
            type = args[0];
            options = {};
        }
        else {
            type = null;
            options = args[0];
        }
    }
    else {
        type = args[0];
        options = args[1];
    }

    return (target, propertyKey) => {

        // If no type is passed, inferred via "design:type" metadata
        if (type == null) {
            const designType = Reflect.getOwnMetadata("design:type", target, propertyKey);
            type = () => designType;
        }

        const serializableField: SerializableField<any, E> = {

            name: propertyKey,
            type: type,
            groups: options.groups,
            extra: options.extra
        };

        // We declare some metadata on the constructor, so the class decorator @Serializable can read
        // and register the class on the SerializerRegistry correctly
        if (!Reflect.hasOwnMetadata(metadataKeys.serialize, target.constructor)) {
            Reflect.defineMetadata(metadataKeys.serialize, [], target.constructor);
        }

        // noinspection JSMismatchedCollectionQueryUpdate
        const serializableFields: Array<SerializableField<any, E>> = Reflect.getOwnMetadata(metadataKeys.serialize, target.constructor);
        serializableFields.push(serializableField);
    };
}
