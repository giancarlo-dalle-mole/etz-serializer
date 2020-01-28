import { Class, metadataKeys, SerializableField, SerializableOptions } from "../common";
import { SerializerRegistry } from "../services";

export function Serializable<T extends Object>(options?: SerializableOptions) {

    return (constructor: Class<T>) => {

        const serializableFields: Array<SerializableField<any, any>> = Reflect.getOwnMetadata(metadataKeys.serialize, constructor);
        Reflect.deleteMetadata(metadataKeys.serialize, constructor);

        SerializerRegistry.addType(constructor, serializableFields, options);
    };
}
