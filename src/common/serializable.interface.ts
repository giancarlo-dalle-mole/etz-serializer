import { JsonWriter } from "../services/json-writer";
import { Json } from "./json.type";

/**
 * Describes method signatures to customize an object serialization/deserialization process for
 * classes marked with {@link #Serializable @Serializable} decorator or programmatically added to
 * registry. When a class implements this interface, the methods {@link writeJson} and {@link readJson}
 * will be called during serialization and deserialization with the object resulted from the default
 * strategy in {@link Serializer.writeJson} and {@link Serializer.readJson}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 23/01/2020
 */
export interface ISerializable<T> {

    /**
     * This method is responsible for customizing the deserialization of the object, restoring it to
     * the original state with the correct prototype. You MAY use this methods in two different ways:
     * changing de default or creating a brand new object from ``json``. In all cases you must return
     * the restored object (``T``).
     *
     * ###
     * ### Generic Types:
     * - ``T``: (optional) The restored object type. MUST be the class itself or not set (inferred).
     *
     * @param json The raw JSON object being deserialized. The object is an instance of Object with
     *        {@link #Json Json<T>} format.
     */
    readJson(json: Json<T>): void;
    /**
     * This method is responsible for customizing the serialization of the object, generating a
     * {@link #Json Json<T>} version that can be converted into JSON. You MAY use this methods in two
     * different ways: changing de default or creating a brand new object from ``instance``. In all
     * cases you must return the serialized object ({@link  #Json Json<T>}).
     *
     * ###
     * ### Generic Types:
     * - ``T``: (optional) The restored object type. MUST be the class itself or not set (inferred).
     *
     * @returns The serialized object as an instance of {@link Object} in {@link #Json Json<T>} format.
     */
    writeJson(serializerOutput: JsonWriter<T>): void;
}
