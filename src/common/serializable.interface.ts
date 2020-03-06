import { JsonReader, JsonWriter } from "../services";
import { Json } from "./types";

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
     * the original state with the correct prototype.
     */
    readJson(jsonReader: JsonReader<T>): void;
    /**
     * This method is responsible for customizing the serialization of the object, generating a
     * {@link #Json Json<T>} version that can be converted into JSON.
     */
    writeJson(jsonWriter: JsonWriter<T>): void;
}
