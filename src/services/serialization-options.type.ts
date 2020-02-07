import { OperationOptions } from "./operation-options.type";

/**
 * Serialization operation options. Some options are inherited from the global configured options on
 * the {@link Serializer} service.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 28/01/2020
 */
export type SerializationOptions = OperationOptions & {

    /**
     * (optional) Overrides global configuration {@link SerializerConfig.typeMetadata}.
     * @default See default in {@link SerializerConfig.typeMetadata}
     */
    typeMetadata?: boolean;
    /**
     * (optional) Overrides global configuration {@link SerializerConfig.objectMetadata}.
     * @default See default in {@link SerializerConfig.objectMetadata}
     */
    objectMetadata?: boolean;
};
