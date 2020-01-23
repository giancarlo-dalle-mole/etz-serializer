import { InstantiationPolicyEnum } from "./public/common";
import { SerializerRegistry } from "./public/services";
import { ArrayTransformer } from "./public/transformers";

SerializerRegistry.addTransformer(ArrayTransformer, Array, {instantiationPolicy: InstantiationPolicyEnum.SINGLETON});
