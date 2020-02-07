import { BehaviorEnum } from "../enums";

/**
 * Global configuration for {@link Serializer} service.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 27/01/2020
 */
export type SerializerConfig = {

    /**
     * (optional) Flag to include object type metadata. Including object type metadata allows
     * transparent object deserialization (deserialization without expectedType), in which case
     * disables types checking but still allows full deserialization.
     * @default true
     */
    typeMetadata?: boolean;
    /**
     * (optional) Flag to includes object metadata defined with Reflect.defineMetadata or @Reflect.metadata.
     * @default true
     */
    objectMetadata?: boolean;
    /**
     * (optional) Flag to enable type checking upon deserialization (requires expectedType to validate
     * root object). If a type is a subtype of the type being checked against, it will pass validation,
     * otherwise it will throw {@link TypeMismatchException}.
     * @default true
     */
    typeCheck?: boolean;
    /**
     * (optional) Configure the behavior of class version check upon deserialization. If configured
     * to {@link BehaviorEnum.ERROR}, will throw {@link VersionMismatchException}. The class version
     * is only checked during deserialization.
     * @default {@link BehaviorEnum.ERROR}
     */
    versionMismatchBehavior?: BehaviorEnum;
};
