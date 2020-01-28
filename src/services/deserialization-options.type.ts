/**
 *
 */
export type DeserializationOptions<E = void> = {

    /**
     * Extra data to be passed to a transformer if the root type requires a transformer (e.g. {@link Array}).
     * If the object was serialized with ``typeMetadata``, this option is optional, but MAY be used,
     * for example, to validate the type of the items of the {@link Array}.
     */
    extra?: E;
};
