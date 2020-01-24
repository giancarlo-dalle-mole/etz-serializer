/**
 * List of metadata keys used to store metadata in objects.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export const metadataKeys = {
    /**
     * Used to store {@link SerializableMetadata} in classes registered as serializable types.
     */
    serializable: "Enterprize:Serializer:serializable",
    /**
     * Used to temporarily store serializable fields in classes to be registered as serializable types.
     * Only used by {@link #Serialize @Serialize} decorator.
     */
    serialize: "Enterprize:Serializer:serialize",
    /**
     * Used to store all the registered serializable types on {@link Reflect} global object.
     */
    registeredTypes: "Enterprize:Serializer:registeredTypes",
    /**
     * Used to store all the registered transformers on {@link Reflect} global object.
     */
    registeredTransformers: "Enterprize:Serializer:registeredTransformers"
};
