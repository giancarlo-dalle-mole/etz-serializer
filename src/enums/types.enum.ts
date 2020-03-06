/**
 * Used to define a type to configure a serializable attribute that cannot be expressed naturally in
 * runtime, such as ``any`` type.
 *
 * @sinceVersion 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */
export enum TypesEnum {
    /**
     * Accepts any type. Use when you do not want to type check.
     */
    ANY = "ANY"
}
