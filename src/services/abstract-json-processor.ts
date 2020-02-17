import { Json, SerializableMetadata } from "../common";

/**
 * Base service object for Read and Write operations of a {@link Json} object.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 17/02/2020
 */
export abstract class AbstractJsonProcessor<T extends Object> {

    //#region Protected Methods
    /**
     * The instance being deserialized.
     */
    protected readonly instance: T;
    /**
     * The class serializable metadata.
     */
    protected readonly metadata: SerializableMetadata;
    /**
     * The json object.
     */
    protected readonly _json: Json<T>;
    //#endregion

    //#region Constructor
    protected constructor(instance: T, metadata: SerializableMetadata, json: Json<T>) {

        this.instance = instance;
        this.metadata = metadata;
        this._json = json;
    }
    //#endregion

    //#region Public Methods
    /**
     * Check if a field is included in a given array of groups.
     * @param fieldGroups The list of groups the field is included.
     * @param groups The list of groups included in the operation.
     * @param excludeUngrouped Flag to exclude fields if they do not belongs to any group and the
     *        operation includes at least one group.
     *
     * @return true if the field should be included, false otherwise.
     */
    public isInGroup(fieldGroups: Array<string>, groups: Array<string>,
                     excludeUngrouped: boolean): boolean {

        if (groups == null || groups.length === 0) {
            return true;
        }
        else if (excludeUngrouped && (fieldGroups == null || fieldGroups.length === 0)) {
            return false;
        }

        if (fieldGroups == null) {
            return true;
        }

        for (let group of fieldGroups) {
            if (groups.includes(group)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Retrieves the {@link Json} being read/write.
     */
    public get json(): Json<T> {
        return this._json;
    }
    //#endregion
}
