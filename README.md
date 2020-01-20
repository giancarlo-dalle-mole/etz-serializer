# Enterprize Serializer (etz-serializer)
Custom classes and native TypeScript/JavaScript classes serialization and deserialization with metadata into JSON compliant standard.

# :warning: IN PROGRESSS, DO NOT USE YET! :warning:

# Features
 
- Serialization of primitives and wrappers;
- Serialization of JavaScript built-ins types: Array, Date, Map and Set;
- Serialization of classes marked for serialization using a default serialization strategy;
- Serialization of objects metadata defined with Reflect library;
- Serialization of cyclic references;
- Custom serialization/deserialization transformers, allowing flexibility and default transformers override;
- Object serialization/deserialization customization per serializable class;   
- Open/Closed principle allowing programmer to override basically everything;
- Minimal or no extra metadata on the output JSON object (configurable globally or per operation);
- Serialization groups/context;
- Custom types transformers, allowing almost anything to be serialized;
- Namespaces and custom names;
- IoC Container aware;
- Minification friendly.\*

\*Minification friendly requires special treatment. More on this on section [**Usage: Minification**](#minification).

## Unsupported features

The following features are not supported, but may be added in the future. If you requires any of the following *unsupported features*, please ask and propose a solution ;).

- Generics - Since TypeScript uses the concept of [Type Erasure](https://en.wikipedia.org/wiki/Type_erasure), its very hard to come up with some architecture and API that does not involve too much manual definitions or JSON pollution;

# Requirements

- ES6+ JavaScript VM;

## Development

- NodeJS 12.x LTS
- TypeScript 3.6.4 

# Usage

# Architecture 

This section describes the internal rules and design decisions used in this library.

> Notice: The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).  

## Commandments

* MUST use Open/Closed principle of SOLID;
* MUST be friendly to IoC containers, such as [Inversify](https://github.com/inversify/InversifyJS);
* MUST only perform serialization/deserialization and type checking. JSON schema validation are other topic and have specific libraries for that (eg.: [AJV](https://github.com/epoberezkin/ajv));
* SHOULD respect JSON standards, unless explicitly said otherwise; 
* SHOULD have minimal performance impact on applications.

## General JSON Serializations

* ``Date`` objects are serialized as ISO strings. (JavaScript ``JSON`` default);
* ``NaN`` values are serialized as ``"NaN"`` string. (JavaScript ``JSON`` uses ``null``);
* ``-Infinity``/``Infinity`` are serialized as ``"-Infinity"`` and ``"Infinity"`` strings. (JavaScript ``JSON`` uses ``null``);
* ``Map`` objects are serialized as tuples <K,V> (eg.: ``[[1, "A"], [2, "B"], [3, {prop: "bar"}]]``). (JavaScript ``JSON`` does not serialize ``Map`` objects, resulting in empty objects - ``{}``);
* ``Set`` objects are serialized as arrays ``[key, value]`` (e.g.: ``[[1, "A"], [2, "B"], [3, {prop: "bar"}]]``). (JavaScript ``JSON`` does not serialize ``Map`` objects, resulting in empty objects - ``{}``);

## Other Rules

* All types/classes not decorated with [``@Serializable``](#serializable) MUST use a [``@Transformer``](#transformert--any-s--any) to perform serialization;
* Global and per operation behavior configuration;
* To enforce wrappers, you MUST use the enum [``TypesEnum.WRAPPER``](#typesenum) in the ``type`` parameter of [``@Serializable``](#serializable);
* Possibility to serialize without creating any metadata;
* Possibility to deserialize without metadata. Requires the ``expectedType`` argument on the [``Serializer#deserializer``](#-public-fromjsont-extends-objectjson-jsont-clazz-classt-options-deserializationoptions-t) or [``Serializer#fromJson``](#-public-fromjsont-extends-objectjson-jsont-clazz-classt-options-deserializationoptions-t) method;
* If a wrapper is used (Number, Boolean, String), but it was not enforced by [``TypesEnum.WRAPPER``](#typesenum) enum, then value MUST be serialized/deserialized as a primitive;

# Public API

## Enums

### ``TypesEnum``

Used to define a type to a [``@Serialize``](#serializee--void) attribute that cannot be expressed naturally in runtime, such as ``any`` type and wrapper enforcement. 

Known usages: [``@Serialize``](#serializee--void)

|Value|Description|
|---|---|
|``ANY``|Accepts any type. Use when you do not want to type check.|
|``WRAPPER``|The type is a wrapper instead of the primitive. Use to define wrapper types.|

### ``BehaviorEnum``

Used to customize behavior on some operations that MAY have different behaviors under certain circumstances or by programmer design choice.  

Known usages: [``SerializerConfig``](#serializer)

|Value|Description|
|---|---|
|``WARNING``|Writes a warning on the console when a given situation happens.|
|``ERROR``|Throws an error when a given situation happens. You MAY want to try-catch theses exceptions.|
|``IGNORE``|Do nothing when a given situation happens.|

### ``InstatiationPolicyEnum``

Used to customize object instantiation policy.

Known usages: [``@Transformer``](#transformert--any-s--any) [``SerializerConfig``](#serializer)

|Value|Description|
|---|---|
|``SINGLETON``|Instantiate only once and then cache.|
|``TRANSIENT``|Gets a new instance every time the object is required.|

## Types

### ``Class<T extends Object = Object>``

Type alias for a class definition.

Generic types:

- ``T``: The type (class) being represented.

Format: ``new(...args: any[]) => T``

Known usages: [``SerializerRegistry``](#serializerregistry), [``Serializer``](#serializer), [``@Serializable``](#serializable), [``@Serialize``](#serializee--void), [``@Transformer``](#transformert--any-s--any)

### ``Json<T extends Object>``

Type alias for a json version of a given class. Only attributes are keep, functions are excluded.

Generic types:

- ``T``: The type (class) of the object this JSON structure represents.

Format: ``Partial<Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>>``

Known usages: [``ISerializable``](#iserializable), [``Serializer``](#serializer)

### ``RegisteredTypesMap``

Type alias for namespace type organization in [``SerializerRegistry``](#serializerregistry).

Format: ``Map<string, Class|RegisteredTypesMap>``

Known usages: [``SerializerRegistry``](#serializerregistry)

## Decorators

### ``@Serializable``

Marks a class as a serializable type, registering it on the [``SerializerRegistry``](#serializerregistry) as a serializable type. Only non abstract classes can be marked as serializable.

Signatures:

- ``@Serializable()``
- ``@Serializable(options: SerializableOptions)``

|Arguments|Type|Description|
|---------|----|-----------|
|``options``|``SerializableOptions``|***(optional)*** Configure registry options.|

|``SerializableOptions``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|-----------------------------------------|:---:|-----------|
|``name``|``string``|***(optional)*** Name of the type. MAY be used to define a custom name. **Default:** ``constructor.name`` (class name)|
|``namespace``|``string``|***(optional)*** Namespace of the type. MAY be used to group related types. **Default:** ``""`` (empty string, global namespace)|
|``version``|``number``|***(optional)*** Define the current version of the type (integer). MAY be used as a version control to prevent bugs of incompatible versions (i.e. client version <> server version). **Default:** ``1``|
|``defaultStrategy``|``boolean``|***(optional)*** Flag to enable the default deserialization strategy used by ``Serializer``. **Default:** ``true``|

### ``@Serialize<E = void>``

Marks a field for serialization. When marking custom types (i.e. programmer defined classes) be aware of the TDZ HELL (*temporal dead zone*) with cyclic dependencies (see TypeScript issue [#14971](https://github.com/microsoft/TypeScript/issues/14971)), in which case the programmer MUST set the ``type`` parameter (errors MAY be thrown if not set), otherwise its optional.

Generic Types:
- ``E``: The ``extra`` type in ``SerializeOptions<E>``;

Signatures:

- ``@Serialize<E = void>()``
- ``@Serialize<E = void>(type: () => Class|Function|TypesEnum|Array<Class|Function|TypesEnum>)``
- ``@Serialize<E = void>(options: SerializeOptions)``
- ``@Serialize<E = void>(type: () => Class|Function|TypesEnum|Array<Class|Function|TypesEnum>, options: SerializeOptions)``

|Arguments|Type|Description|
|---|:---:|---|
|``type``|``Class`` ``Function`` ``TypesEnum`` ``Array<Class Function TypesEnum>``|***(optional)*** The type or a list of types that the field holds. **Note:** When using user defined classes with cyclic dependencies this MUST be set to prevent TDZ errors. **Default:** infered by reflection (``"design:type"``).|
|``options``|``SerializeOptions<E>``|***(optional)*** Defines serialization options, such as groups.|

|``SerializeOptions<E>``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|---|:---:|---|
|``groups``|``Array<string>``|***(optional)*** A list of serialization groups to include the attribute during serialization/deserialization.|
|``extra``|``E``|***(optional)*** Some extra data to be passed to the ``Transformer`` during serialization/deserialization. An example of usage is for ``Array`` on the ``ArrayTransformer`` (``ArrayExtra``).

### ``@Transformer<T = any, S = any>``

Marks a class a type transformer to be used during serialization/deserialization. The type is registered on the [``SerializerRegistry``](#serializerregistry). This decorator provides a declarative way to define a transformer instead of the direct use of [``SerializerRegistry#addTransformer``](#-public-static-addtransformert--any-s--anyclazz-class-transformer-itransformerstatict-s-void) method. The class MUST implement the ``ITransformer<T, S>`` interface.

The default behavior is to instantiate only once and cache the object for the rest of the application lifecycle. This can be changed by setting the parameter ``TransformerOptions.instatiationBehavior``.

Generic Types:

- ``T``: The type to be transformed before serialization (input);
- ``S``: The transformed type after serialization (output);

Signatures:

- ``@Transformer<T = any, S = any>(type: Class)``
- ``@Transformer<T = any, S = any>(type: Class, options: TransformerOptions)``

|Arguments|Type|Description|
|---|:---:|---|
|``type``|``Class``|The type to be transformed in a JSON compatible format.|
|``options``|``TransformerOptions``|(optional) Defines transformer options, such as instantiation policy.

|``TransformerOptions``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|---|:---:|---|
|``instantiationPolicy``|``InstantiationPolicyEnum``|***(optional)*** The specific policy of this transformer instantiation. Overrides global policy in ``SerializerConfig``. When using IoC containers with the adapter, this argument is passed to the ``IIoCContainerAdapter#bind`` method.  **Default:** ``InstantiationPolicyEnum.SINGLETON``.

## Interfaces

### ``ISerializable``

Describes method signatures to customize an object serialization/deserialization process for classes marked with [``@Serializable``](#serializable) decorator. When a class implements this interface and the default [``Serializer``](#serializer) is used, the methods ``writeJson`` and ``readJson``  will be called during serialization and deserialization with the object resulted from the default strategy in [``Serializer#writeJson``](#-protected-writejsontinstance-t-jsont) and [``Serializer#readJson``](#-protected-readjsontjson-jsont-t).

You MAY disable the default serialization/deserialization strategy for the class by setting the option ``defaultStrategy`` in ``@Serializable`` to ``false``.

|Methods Summary|Description|
|---|---|
|[``public readJson<T>(default: T, json: Json<T>): T``](#-public-readjsontdefault-t-json-jsont-t)|Customize the deserialization operation. |
|[``public writeJson<T>(default: Json<T>, instance: T): Json<T>``](#-public-writejsontdefault-jsont-instance-t-jsont)|Customize the serialization operation.|

#### # ``public readJson<T>(default: T, json: Json<T>): T``

This method is responsible for customizing the deserialization of the object, restoring it to the original state with the correct prototype. You MAY use this methods in two different ways: changing de ``default`` or creating a brand new object from ``json``. In all cases you must return the restored object (``T``).

Generic Types:

- ``T``: ***(optional)*** The restored object type. MUST be the class itself or not set (inferred). 

|Parameters|Type|Description|
|---|:---:|---|
|``default``|``T``|The deserialized object using the default deserialization strategy. The object is an instance of ``T``.|
|``json``|``Json<T>``|The raw JSON object being deserialized. The object is an instance of ``Object`` with ``Json<T>`` format.|

|Returns|
|:---:|
|The deserialized object as an instance of ``T``.|

#### # ``public writeJson<T>(default: Json<T>, instance: T): Json<T>``

This method is responsible for customizing the serialization of the object, generating a ``Json<T>`` version that can be converted into JSON. You MAY use this methods in two different ways: changing de ``default`` or creating a brand new object from ``instance``. In all cases you must return the serialized object (``Json<T>``).

Generic Types:

- ``T``: ***(optional)*** The type of the object to be serialized. MUST be the class itself or not set (inferred).

|Parameters|Type|Description|
|---|:---:|---|
|``default``|``Json<T>``|The serialized object using the default serialization strategy. The object is an instance of ``Object`` with ``Json<T>`` format.|
|``instance``|``T``|The object instance to be serialized. The object is an instance of ``T``.|

|Returns|
|:---:|
|The serialized object as an instance of ``Object`` in ``Json<T>`` format.|

## Classes

### ``Serializer``

The service that performs serialization and deserialization process. Can be configured globally or per operation to change the serialization and deserialization behaviors, such as including or not ``typeMetadata`` and performing other operations.

|Methods Summary|Description|
|---|---|
|[``public getConfig(): SerializerConfig``](#-public-getconfig-serializerconfig)|Retrieves the global configuration of the serializer service.|
|[``public setConfig(config: SerializationConfig): void``](#-public-setconfigconfig-serializationconfig-void)|Sets the global configuration of the serializer service.|
|[``public clone<T extends Object>(instance: T): T``](#-public-clonet-extends-objectinstance-t-t)|Performs a deep clone of the object.|
|[``public serialize<T extends Object>(instance: T Array<T>, options?: SerializationOptions): string``](#-public-serializet-extends-objectinstance-tarrayt-options-serializationoptions-string)|Serializes an object or an array of objects into a ``JSON`` ``string``.|
|[``public deserialize<T extends Object>(json: string, options?: DeserializationOptions): T``](#-public-deserializet-extends-objectjson-string-options-deserializationoptions-t)|Deserializes a an ``JSON`` ``string`` into ``T``.|
|[``public deserialize<T extends Object>(json: string, clazz: Class<T> options?: DeserializationOptions): T``](#-public-deserializet-extends-objectjson-string-options-deserializationoptions-t)|Deserializes a an ``JSON`` ``string`` into ``T`` by using ``clazzz`` as root type or type checking.|
|[``public toJson<T extends Object>(instance: T, options?: SerializationOptions): Json<T>``](#-public-tojsont-extends-objectinstance-t-options-serializationoptions-jsont)|Converts a given instance of a class to its "JSON object" version, including, if configured, the necessary metadata to convert it back to a instance of the class.|
|[``public toJson<T extends Object>(instances: Array<T>, options?: SerializationOptions): Array<Json<T>>``](#-public-tojsont-extends-objectinstances-arrayt-options-serializationoptions-arrayjsont)|Converts a given array of instances of a class to its "json object" version, including, if configured, the necessary metadata to convert it back to a instance of the class.|
|[``public fromJson<T extends Object>(json: Json<T>, options?: DeserializationOptions): T``](#-public-fromjsont-extends-objectjson-jsont-options-deserializationoptions-t)|Restores a given json object to its original instance of class, if possible. For the restoration process to work for some given classes, some metadata must be set.|
|[``public fromJson<T extends Object>(json: Array<Json<T>>, options?: DeserializationOptions): Array<T>``](#-public-fromjsont-extends-objectjson-jsont-clazz-classt-options-deserializationoptions-t)|Restores a given array of json objects to its original instance of class, if possible. For the restoration process to work for some given classes, some metadata must be set.|
|[``public fromJson<T extends Object>(json: Json<T>, clazz: Class<T>, options?: DeserializationOptions): T``](#-public-fromjsont-extends-objectjson-arrayjsont-options-deserializationoptions-arrayt)|Restores a given json object to its original instance of class, if possible, using a specific class to validate or as the type of the root object. For the restoration process to work for some given classes, some metadata must be set.|
|[``public fromJson<T extends Object>(json: Array<Json<T>>, clazz: Class<T>, options?: DeserializationOptions): Array<T>``](#-public-fromjsont-extends-objectjson-arrayjsont-clazz-classt-options-deserializationoptions-arrayt)|Restores a given array of json objects to its original instance of class, if possible, using a specific class to validate or as the type of the root object. For the restoration process to work for some given classes, some metadata must be set.|
|[``protected readJson<T>(json: Json<T>): T``](#-protected-readjsontjson-jsont-t)|***protected*** Default deserialization strategy for ``@Serializable`` classes. Classes that implements ``ISerializable`` will receive the result of this method and can customize the operation per class. Override this method to customize the default deserialization process.|
|[``protected writeJson<T>(instance: T): Json<T>``](#-protected-writejsontinstance-t-jsont)|***protected*** Default serialization strategy for ``@Serializable`` classes. Classes that implements ``ISerializable`` will receive the result of this method and can customize the operation per class. Override this method to customize the default serialization process.|

|``SerializerConfig``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|---|:---:|---|
|``typeMetadata``|``boolean``|***(optional)*** Flag to include object type metadata. Including object type metadata allows transparent object deserialization (deserialization without ``expectedType``), in which case disables types checking but still allows full deserialization. **Default:** ``true``|
|``objectMetadata``|``boolean``|***(optional)*** Flag to includes object metadata defined with ``Reflect.defineMetadata`` or  ``@Reflect.metadata`` **Default:** ``true``|
|``typeCheck``|``boolean``|***(optional)*** Flag to enable type checking upon deserialization (requires ``expectedType`` to validate root object). If a type is a subtype of the type being checked against, it will pass validation, otherwise it will throw ``TypeMismatchException``. **Default:** ``true``|
|``versionMismatchBehavior``|``BehaviorEnum``|***(optional)*** Configure the behavior of class version check upon deserialization. If configured to ``BehaviorEnum.ERROR``, will throw ``VersionMismatchException``. **Default:** ``BehaviorEnum.ERROR``

|``SerializationOptions``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|---|:---:|---|
|``typeMetadata``|``boolean``|***(optional)*** Overrides global configuration ``SerializerConfig.typeMetadata``|
|``objectMetadata``|``boolean``|***(optional)*** Overrides global configuration ``SerializerConfig.objectMetadata``|
|``groups``|``Array<string>``|***(optional)*** Groups to include in serialization process. By default if no group is passed, all attributes will be serialized. If a group is set, only non grouped attributes and attributes that belongs to any of the specified group will be serialized. You may exclude the ungrouped attributes by setting the flag ``excludeUngrouped``.|
|``excludeUngrouped``|``boolean``|***(optional)*** Flag to exclude ungrouped attributes, keeping only attributes that belongs to any of the defined ``groups``. **Default:** ``false``

|``DeserializationOptions``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|---|:---:|---|
|``typeCheck``|``boolean``|***(optional)*** Overrides global configuration ``SerializerConfig.typeCheck``|
|``groups``|``Array<string>``|***(optional)*** Groups to include in deserialization process. By default if no group is passed, all attributes will be deserialized. If a group is set, only non grouped attributes and attributes that belongs to any of the specified group will be deserialized. You may exclude the ungrouped attributes by setting the flag ``excludeUngrouped``.|
|``excludeUngrouped``|``boolean``|***(optional)*** Flag to exclude ungrouped attributes, keeping only attributes that belongs to any of the defined ``groups``. **Default:** ``false``

#### Methods details

##### # ``public getConfig(): SerializerConfig``

##### # ``public setConfig(config: SerializationConfig): void``

##### # ``public clone<T extends Object>(instance: T): T``

##### # ``public serialize<T extends Object>(instance: T|Array<T>, options?: SerializationOptions): string``

##### # ``public deserialize<T extends Object>(json: string, options?: DeserializationOptions): T``

##### # ``public deserialize<T extends Object>(json: string, clazz: Class<T> options?: DeserializationOptions): T``

##### # ``public toJson<T extends Object>(instance: T, options?: SerializationOptions): Json<T>;``

Converts a given instance of a class to its "JSON object" version, including, if configured, the necessary metadata to convert it back to a instance of the class.

Generic types:
- ``T``: ***(optional)*** The object type (class) to be transformed into ``Json<T>``. **Default:** inferred.


|Parameters|Type|Description|
|---|:---:|---|
|``instance``|``T``|The object to be converted into ``Json<T>``.|
|``options``|``SerializerOptions``|***(optional)*** Configure how the operation should be done. **Default:** Uses the global configuration.|

|Throws|Description|
|:---:|---|
|``ArrayDimensionsOutOfRangeException``||
|``IheritanceNonSerializableException``||
|``NonSerializableException``||
|``TypeMismatchException``||
|``VersionMismatchException``||

|Returns|
|---|
|The instance converted to "JSON object" (plain object)|

##### # ``public toJson<T extends Object>(instances: Array<T>, options?: SerializationOptions): Array<Json<T>>``

Converts a given array of instances of a class to its "json object" version, including, if configured, the necessary metadata to convert it back to a instance of the class.

Generic types:
- ``T``: ***(optional)*** The object type (class) to be transformed into ``Json<T>``. **Default:** inferred.

|Parameters|Type|Description|
|---|:---:|---|
|``instances``|``Array<T>``|The array of objects to be converted into ``Json<T>``.|
|``options``|``SerializerOptions``|***(optional)*** Configure how the operation should be done. **Default:** Uses the global configuration.|

|Throws|Description|
|:---:|---|
|``ArrayDimensionsOutOfRangeException``||
|``IheritanceNonSerializableException``||
|``NonSerializableException``||
|``TypeMismatchException``||
|``VersionMismatchException``||

|Returns|
|---|
|The array converted to "JSON object" (plain object)|

##### # ``public fromJson<T extends Object>(json: Json<T>, options?: DeserializationOptions): T``

##### # ``public fromJson<T extends Object>(json: Array<Json<T>>, options?: DeserializationOptions): Array<T>``

##### # ``public fromJson<T extends Object>(json: Json<T>, clazz: Class<T>, options?: DeserializationOptions): T``

##### # ``public fromJson<T extends Object>(json: Array<Json<T>>, clazz: Class<T>, options?: DeserializationOptions): Array<T>``

##### # ``protected readJson<T>(json: Json<T>): T``

##### # ``protected writeJson<T>(instance: T): Json<T>``

### ``SerializerRegistry``

***static class*** Holds information for all registered types marked with [``@Serializable``](#serializable) decorator and all transformers marked with [``@Transformer``](#transformert--any-s--any). Also provides methods to programmatically retrieve and add types and transformers. 

|Method Summary|Description|
|---|---|
|``public static getTypes(): Map<string, RegisteredTypesMap>``|Gets the list of registered serializable types.|
|``public static addType(clazz: Class, name?: string, namespace?: string, version?: number): void``|Registers a type in the registry as a serializable type. Imperative way instead of [``@Serializable``](#serializable).|
|``public getTransformers(): Map<Class, ITransformer<any, any>>: void``|Gets the list of registered type transformers.|
|``public addTransformer<T = any, S = any>(clazz: Class, transformer: ITransformerStatic<T, S>): void``|Registers a type transformer in the registry. Imperative way of [``@Transformer``](#transformert--any-s--any)|

### Methods details

##### # ``public static getTypes(): Map<string, RegisteredTypesMap>``

##### # ``public static addType(clazz: Class, name?: string, namespace?: string, version?: number): void``

##### # ``public static getTransformers(): Map<Class, ITransformer<any, any>>: void``

##### # ``public static addTransformer<T = any, S = any>(clazz: Class, transformer: ITransformerStatic<T, S>): void``

### ``ArrayTransformer implements ITransformer<Array<any>, Array<any>``

Default ``Array`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)

### ``BooleanTransformer implements ITransformer<Boolean|boolean, boolean>``

Default ``Boolean`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)

### ``MapTransformer implements ITransformer<Map<any, any>, Array<[any, any]>>``

Default ``Map`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)

### ``NumberTransformer implements ITransformer<Number|number, number>``

Default ``Number`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)

### ``ObjectTransformer implements ITransformer<Object, Json<Object>>``

Default ``Object`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)

### ``SetTransformer implements ITransformer<Set<any>, Array<any>>``

Default ``Set`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)

### ``StringTransformer implements ITransformer<String|string, string>``

Default ``String`` transformer.

Decorated with: [``@Transformer``](#transformert--any-s--any)
