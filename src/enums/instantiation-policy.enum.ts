/**
 * Used to customize object instantiation policy.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 21/01/2020
 */
export enum InstantiationPolicyEnum {
    /**
     * Instantiate only once and then cache.
     */
    SINGLETON,
    /**
     * Gets a new instance every time the object is required.
     */
    TRANSIENT
}
