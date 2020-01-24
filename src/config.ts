import { InstantiationPolicyEnum } from "./common";
import { SerializerRegistry } from "./services";
import { ArrayTransformer, BooleanTransformer, MapTransformer } from "./transformers";

/**
 * Configure some package aspects.
 *
 * @version 1.0.0
 * @author Giancarlo Dalle Mole
 * @since 24/01/2020
 */

//Registers the default transformers

SerializerRegistry.addTransformer(
    ArrayTransformer,
    Array,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    BooleanTransformer,
    Boolean,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    MapTransformer,
    Map,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
