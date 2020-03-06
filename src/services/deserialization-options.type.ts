import { BehaviorEnum } from "../enums";
import { OperationOptions } from "./operation-options.type";

/**
 * Deserialization operation options. Some options are inherited from the global configured options
 * on the {@link Serializer} service.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 28/01/2020
 */
export type DeserializationOptions<E = void> = OperationOptions & {

    /**
     * (optional) Overrides global configuration {@link SerializerConfig.objectMetadata}.
     * @default See default in {@link SerializerConfig.objectMetadata}
     */
    objectMetadata?: boolean;
    /**
     * (optional) Flag to enable type checking upon deserialization (requires expectedType to validate
     * root object). If a type is a subtype of the type being checked against, it will pass validation,
     * otherwise it will throw {@link TypeMismatchException}.
     * @default See default in {@link SerializerConfig.typeCheck}
     */
    typeCheck?: boolean;
    /**
     * (optional) Configure the behavior of class version check upon deserialization. If configured
     * to {@link BehaviorEnum.ERROR}, will throw {@link VersionMismatchException}. The class version
     * is only checked during deserialization. This option is irrelevant with {@link typeMetadata} disabled.
     * @default {@link SerializerConfig.versionMismatchBehavior}
     */
    versionMismatchBehavior?: BehaviorEnum;
};
