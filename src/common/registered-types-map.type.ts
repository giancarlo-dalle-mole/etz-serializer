import { Class } from "./class.type";

/**
 * Type alias for namespace type organization in {@link SerializerRegistry}.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 20/01/2020
 */
export type RegisteredTypesMap = Map<string, Class|RegisteredTypesMap>;
