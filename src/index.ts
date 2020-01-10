import "reflect-metadata";

function serialize(type?: any): PropertyDecorator {

    return (target, propertyKey) => {
        const designType = Reflect.getOwnMetadata("design:type", target, propertyKey);
        console.log(designType);
    }
}

class MyClass {

    @serialize()
    public primitiveNumber: number;

    @serialize(() => Number)
    public wrapperNumber: Number;
}
