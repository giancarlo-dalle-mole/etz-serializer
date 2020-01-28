/**
 * Serialization operation options. Some options are inherited from the global configured options on
 * the {@link Serializer} service.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 28/01/2020
 */
export type SerializationOptions = {

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
    /**
     * (optional) Groups to include in serialization process. By default if no group is passed, all
     * attributes will be serialized. If a group is set, only non grouped attributes and attributes
     * that belongs to any of the specified group will be serialized. You may exclude the ungrouped
     * attributes by setting the flag {@link excludeUngrouped}.
     */
    groups?: Array<string>;
    /**
     * (optional) Flag to exclude ungrouped attributes, keeping only attributes that belongs to any
     * of the defined groups.
     * @default false
     */
    excludeUngrouped?: boolean;
};
