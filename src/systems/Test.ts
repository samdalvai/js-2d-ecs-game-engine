import AnimationComponent from '../components/AnimationComponent';
import Component, { ComponentClass } from '../ecs/Component';

function createInstance<T extends new (...args: any[]) => InstanceType<T>>(
    Class: T,
    ...args: ConstructorParameters<T>
): InstanceType<T> {
    return new Class(...args);
}

class BaseClass {}

class MyClass extends BaseClass {
    constructor(
        public name: string = '',
        public age: number = 1,
    ) {
        super();
    }
}

class AnotherClass {} // Does not extend BaseClass

const myInstance = createInstance(MyClass, 'John', 30); // Correct usage
const wrongParams = createInstance(MyClass, 'John', '30'); // Compiler error: age should be number
const wrongInstance2 = createInstance(AnotherClass); // Compiler error: age should be number

function getComponent<T extends new (...args: any[]) => any>(ComponentClass: T, ...args: ConstructorParameters<T>): T {
    return new ComponentClass();
}

const comp1 = getComponent(AnimationComponent, 1, 2);
const comp2 = getComponent(AnimationComponent, 'hello', 23);
const comp3 = getComponent(MyClass);
