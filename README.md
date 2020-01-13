# Enterprize Serializer (etz-serializer)
Custom classes and native TypeScript/JavaScript classes serialization and deserialization with metadata into JSON compliant standard.

## :warning: IN PROGRESSS, DO NOT USE YET! :warning:

## Features
 
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
- Minification friendly.\**

<sub><sup>
\*Minification friendly requires special treatment. More on this on section [**Usage: Minification**](#minification).
</sup></sub>

## Unsupported features

The following features are not supported, but may be added in the future. If you requires any of the following *unsupported features*, please ask and propose a solution ;).

- Generics - Since TypeScript uses the concept of [Type Erasure](https://en.wikipedia.org/wiki/Type_erasure), its very hard to come up with some architecture and API that does not involve too much manual definitions or JSON pollution;

## Requirements

* ES6+ JavaScript VM; 

## Usage

## Architecture 

This section describes the internal rules and design decisions used in this library.

> Notice: The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).  

#### Commandments

* MUST use Open/Closed principle of SOLID;
* MUST be friendly to IoC containers, such as [Inversify](https://github.com/inversify/InversifyJS);
* MUST only perform serialization/deserialization and type checking. JSON schema validation are other topic and have specific libraries for that (eg.: [AJV](https://github.com/epoberezkin/ajv));
* SHOULD respect JSON standards, unless explicitly said otherwise; 
* SHOULD have minimal performance impact on applications.

#### General JSON Serializations

* ``Date`` objects are serialized as ISO strings. (JavaScript ``JSON`` default);
* ``NaN`` values are serialized as ``"NaN"`` string. (JavaScript ``JSON`` uses ``null``);
* ``-Infinity``/``Infinity`` are serialized as ``"-Infinity"`` and ``"Infinity"`` strings. (JavaScript ``JSON`` uses ``null``);
* ``Map`` objects are serialized as tuples <K,V> (eg.: ``[[1, "A"], [2, "B"], [3, {prop: "bar"}]]``). (JavaScript ``JSON`` does not serialize ``Map`` objects, resulting in empty objects - ``{}``);
* ``Set`` objects are serialized as arrays ``[key, value]`` (e.g.: ``[[1, "A"], [2, "B"], [3, {prop: "bar"}]]``). (JavaScript ``JSON`` does not serialize ``Map`` objects, resulting in empty objects - ``{}``);

#### Other rules

* All types/classes not decorated with ``@Serializable`` MUST use a ``Transformer`` to perform serialization;
* Global and per operation behavior configuration;
* To enforce wrappers, you MUST use the enum ``TypesEnum.WRAPPER`` in the ``type`` parameter of ``@Serializable``;
* Possibility to serialize without creating any metadata;
* Possibility to deserialize without metadata. Requires the ``expectedType`` argument on the ``fromJson`` method;
* If a wrapper is used (Number, Boolean, String), but it was not enforced by ``TypesEnum.WRAPPER`` enum, then value MUST be serialized/deserialized as a primitive;

## Public API

### Enums

#### ``TypesEnum``

Used to define a type to a ``@Serialize`` attribute that cannot be expressed naturally in runtime, such as ``any`` type and wrapper enforcement. 

Known usages: ``@Serialize``

|Value|Description|
|---|---|
|``ANY``|Accepts any type. Use when you do not want to type check.|
|``WRAPPER``|The type is a wrapper instead of the primitive. Use to define wrapper types.|

#### ``BehaviorEnum``

Used to customize behavior on some operations that MAY have different behaviors under certain circumstances or by programmer design choice.  

Known usages: ``ISerilizer``, ``SerializerConfig``

|Value|Description|
|---|---|
|``WARNING``|Writes a warning on the console when a given situation happens.|
|``ERROR``|Throws an error when a given situation happens. You MAY want to try-catch theses exceptions.|
|``IGNORE``|Do nothing when a given situation happens.|

### ``InstatiationPolicyEnum``

Used to customize object instantiation policy.

Known usages: ``@Transformer`` ``SerializerConfig``

|Value|Description|
|---|---|
|SINGLETON|Instantiate only once and then cache.|
|TRANSIENT|Gets a new instance every time the object is required.|

### Decorators

#### ``@Serializable``

Marks a class as a serializable type, registering it on the ``SerializerRegistry`` as a serializable type. Only non abstract classes can be marked as serializable.

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

#### ``@Serialize<E = void>``

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

#### ``@Transformer<T = any, S = any>``

Marks a class a type transformer to be used during serialization/deserialization. The type is registered on the ``SerializerRegistry``. This decorator provides a declarative way to define a transformer instead of the direct use of ``SerializerRegistry#addTransformer`` method. The class MUST implement the ``ITransformer<T, S>`` interface.

The default behavior is to instantiate only once and cache the object for the rest of the application lifecycle. This can be changed by setting the parameter ``instatiationBehavior``.

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

### Interfaces

#### ``ISerializer``

Basic interface that describes an serialization/deserialization service. Can be implemented to provide custom serialization/deserialization services.

You SHOULD extend the ``Serializer`` class instead of rewriting the entire logic. 

Known usages: ``Serializer``

|Method|Signature|Summary|
|---|:---:|---|
|||

#### ``ISerializable``

Describes method signatures to customize an object serialization/deserialization process for classes marked with [``@Serializable``](#serializable) decorator. When a class implements this interface and the default ``Serializer`` is used, the methods ``writeJson`` and ``readJson``  will be called during serialization and deserialization with the object resulted from the default strategy in ``Serializer#writeJson`` and ``Serializer#readJson``.

#### Classes

### ``Serializer``

|``SerializerConfig``<br><sub><sup>(Type)</sup></sub>|Type|Description|
|---|:---:|---|
|``typeMetadata``|``boolean``|***(optional)*** Flag to include object type metadata. Including object type metadata allows transparent object deserialization (deserialization without ``expectedType``), in which case disables types checking but still allows full deserialization. **Default:** ``true``|
|``objectMetadata``|``boolean``|***(optional)*** Flag to includes object metadata defined with ``Reflect.defineMetadata`` or  ``@Reflect.metadata`` **Default:** ``true``|
|``typeCheck``|``boolean``|***(optional)*** Flag to enable type checking upon deserialization (requires ``expectedType`` to validate root object). If a type is a subtype of the type being checked against, it will pass validation, otherwise it will throw ``TypeMismatchException``. **Default:** ``true``|
|``versionMismatchBehavior``|``BehaviorEnum``|***(optional)*** Configure the behavior of class version check upon deserialization. If configured to ``BehaviorEnum.ERROR``, will throw ``VersionMismatchException``. **Default:** ``BehaviorEnum.ERROR``
||

### ``SerializerRegistry``

Static class.

### ``SerializerMetadataReader``

Static class.
