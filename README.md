# Enterprize Serializer (etz-serializer)
Custom classes and native TypeScript/JavaScript classes serialization and deserialization with metadata into JSON compliant standard.

## :warning: IN PROGRESSS, DO NOT USE YET! :warning:

## Features
 
- Serialization of primitives and wrappers;
- Serialization of JavaScript built-ins types: Array, Date, Map and Set;
- Serialization of classes marked for serialization using a default serialization strategy;
- Serialization of objects metadata defined with Reflect library;
- Serialization of cyclic references;
- API to define custom serialization/deserialization transformers, allowing flexibility and default strategy override;
- Open/Closed principle allowing programmer to override basically everything;
- Minimal or no extra metadata on the output JSON object (configurable globally or per operation);
- Serialization groups/context;
- Custom types transformers, allowing almost anything to be serialized;
- Namespaces and custom names;
- Minification friendly*

*Minification friendly requires the definition of *custom names* even if the name of a given class will not be different than the class name. More on this behavior on section **Usage Notes**.

## Unsupported features

The following features are not supported, but may be added in the future. ;)

- Generics - Since TypeScript uses the concept of [Type Erasure](https://en.wikipedia.org/wiki/Type_erasure), its very hard to come up with some architecture and API that does not involve too many manual definitions or JSON pollution;

## Requirements

* ES6+ JavaScript VM; 

### Usage Notes

## Architecture 

> Notice: The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).  

#### Commandments

* MUST use Open/Closed principle of SOLID;
* MUST be friendly to IoC containers, such as [Inversify](https://github.com/inversify/InversifyJS)
* SHOULD respect JSON standards, unless explicitly said otherwise; 
* MUST only perform serialization/deserialization and type checking. JSON schema validation are other topic and have specific libraries for that (eg.: [AJV](https://github.com/epoberezkin/ajv));
* SHOULD have minimal performance impact on applications;

#### General JSON Serializations

* ``Date`` objects are serialized as ISO strings. (JavaScript ``JSON`` default);
* ``NaN`` values are serialized as ``"NaN"`` string. (JavaScript ``JSON`` default uses ``null``);
* ``-Infinity``/``Infinity`` are serialized as ``"-Infinity"`` and ``"Infinity"`` strings. (JavaScript ``JSON`` default uses ``null``);
* ``Map`` objects are serialized as tuples <K,V> (eg.: ``[[1, "A"], [2, "B"], [3, {prop: "bar"}]]``). (JavaScript ``JSON`` does not serialize ``Map`` objects, resulting in empty objects - ``{}``);
* ``Set`` objects are serialized as arrays ``[key, value]`` (eg.: ``[[1, "A"], [2, "B"], [3, {prop: "bar"}]]``). (JavaScript ``JSON`` does not serialize ``Map`` objects, resulting in empty objects - ``{}``);

#### Other rules

* All types not decorated with ``@Serializable`` MUST use a ``Transformer`` to perform serialization;
* Global and per operation behavior configuration;
* To enforce wrappers, one MUST use the enum ``TypesEnum.WRAPPER`` in the ``type`` attribute of ``@Serializable``;
* Possibility to serialize without creating any metadata;
* Possibility to deserialize without metadata. Requires the ``expected type`` argument on the ``fromJson`` method;
* If a wrapper is used (Number, Boolean, String), but it was not enforced by ``TypesEnum.WRAPPER`` enum, then value MUST be serialized/deserialized as a primitive;

## Public API

### Enums

#### ``TypesEnum``

Used to define a type to a @Serialize attribute that cannot be expressed naturally in runtime, such as ``any`` type and wrapper enforcement. 

Known usages: ``@Serialize``

|Value|Description|
|-----|-----------|
|``ANY``|Accepts any type. Use when you do not want to type check.|
|``WRAPPER``|The type is a wrapper instead of the primitive. Use to define wrapper types or to enforce them.|

#### ``BehaviorEnum``

Used to customize behavior on some operations that MAY have different behaviors under certain circumstances or by programmer design taste.  

Known usages: ``ISerilizer``, ``SerializerConfig``

|Value|Description|
|-----|-----------|
|``WARNING``|Writes a warning on the console when a given situation happens.|
|``ERROR``|Throws an error when a given situation happens.|
|``IGNORE``|Do nothing when a given situation happens.|

### Decorators

#### ``@Serializable``

Marks a class as a serializable type, registering it on the ``SerializerRegistry`` as a serializable type. Only non abstract classes MUST be marked as serializable.

Signatures:

- ``@Serializable()``
- ``@Serializable(options: SerializableOptions)``

|Arguments|Type|Description|
|---------|----|-----------|
|``options``|``SerializableOptions``|***(optional)*** Configure registry options.|

|``SerializableOptions``<br><sub>(Type)</sub>|Type|Description|
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
- ``@Serialize<E = void>(type: () => Class|Function|TypesEnum)``
- ``@Serialize<E = void>(options: SerializeOptions)``
- ``@Serialize<E = void>(type: () => Class|Function|TypesEnum, options: SerializeOptions)``

|Arguments|Type|Description|
|---|:---:|---|
|``type``|``function``|***(optional)*** The type that the field holds. **Note:** When using user defined classes with cyclic dependencies this MUST be set to prevent TDZ errors. **Default:** infered by reflection (``"design:type"``).|
|``options``|``SerializeOptions<E>``|***(optional)*** Defines serialization options, such as groups.|

|``SerializeOptions<E>``<br><sub>(Type)</sub>|Type|Description|
|---|:---:|---|
|``groups``|``Array<string>``|***(optional)*** A list of serialization groups to include the attribute during serialization/deserialization.|
|``extra``|``E``|***(optional)*** Some extra data to be passed to the ``Transformer`` during serialization/deserialization. An example of usage is for ``Array`` on the ``ArrayTransformer`` (``ArrayExtra``).
