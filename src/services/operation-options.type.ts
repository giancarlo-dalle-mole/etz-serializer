/**
 * Base serialization/deserialization operation options.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 07/02/2020
 */
export type OperationOptions = {

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
}
