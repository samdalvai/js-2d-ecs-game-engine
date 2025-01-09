import AnimationComponent from '../components/AnimationComponent';
import CameraFollowComponent from '../components/CameraFollowComponent';
import Component from '../ecs/Component';
import System from '../ecs/System';
import CameraMovementSystem from './CameraMovementSystem';

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

function getComponent<T extends Component>(
    ComponentClass: ComponentClass<T>,
    ...args: ConstructorParameters<typeof ComponentClass>
): T {
    return new ComponentClass(...args);
}

const comp1 = getComponent(AnimationComponent, 1, 2);
const comp2 = getComponent(AnimationComponent, 'hello', 23);
const comp3 = getComponent(MyClass);

type SystemClass<T extends System> = {
    new (...args: any[]): T;
    getId(): number;
};

function addSystem<T extends System>(SystemClass: SystemClass<T>, ...args: ConstructorParameters<typeof SystemClass>) {
    const newSystem = new SystemClass(...args);
}

type ComponentClass<T extends Component> = {
    new (...args: any[]): T;
    getId(): number;
};

function addComponent<T extends Component>(
    ComponentClass: ComponentClass<T>,
    ...args: ConstructorParameters<typeof ComponentClass>
) {
    const newComponent = new ComponentClass(...args);
}

addSystem(CameraMovementSystem);
addSystem(CameraFollowComponent);
addSystem(MyClass);

addComponent(CameraFollowComponent);
addComponent(CameraMovementSystem);
addComponent(MyClass);
addComponent(AnotherClass);
