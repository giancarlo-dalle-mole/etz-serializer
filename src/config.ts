import { InstantiationPolicyEnum } from "./enums";
import { SerializerRegistry } from "./services";
import {
    ArrayTransformer, BooleanTransformer, DateTransformer, MapTransformer, NumberTransformer,
    ObjectTransformer, SetTransformer, StringTransformer
} from "./transformers";

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
    DateTransformer,
    Date,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    MapTransformer,
    Map,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    NumberTransformer,
    Number,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    ObjectTransformer,
    Object,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    SetTransformer,
    Set,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
SerializerRegistry.addTransformer(
    StringTransformer,
    String,
    {instantiationPolicy: InstantiationPolicyEnum.SINGLETON}
);
