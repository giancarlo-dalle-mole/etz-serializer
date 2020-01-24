import { InstantiationPolicyEnum } from "./instantiation-policy.enum";

/**
 * Options to configure a {@link ITransformer}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 21/01/2020
 */
export type TransformerOptions = {

    /**
     * (optional) The specific policy of this transformer instantiation. Overrides global policy in
     * SerializerConfig.
     * @default {@link InstantiationPolicyEnum.SINGLETON}.
     */
    instantiationPolicy?: InstantiationPolicyEnum;
    /**
     * (optional) Flag to allow an existing type transformer to be overridden, otherwise an
     * {@link TransformerAlreadyDefinedException} is thrown when trying to override an existing
     * {@link ITransformer} definition for a given type.
     * @default false
     */
    override?: boolean;
}
