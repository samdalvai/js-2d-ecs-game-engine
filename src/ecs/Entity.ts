import Component, { ComponentClass } from './Component';
import Registry from './Registry';

export default class Entity {
    private id: number;
    registry: Registry | undefined;

    constructor(id: number) {
        this.id = id;
    }

    getId = () => {
        return this.id;
    };

    addComponent<T extends Component>(
        ComponentClass: ComponentClass<T>,
        ...args: ConstructorParameters<{ new (...args: any[]): T }>
    ): void {
        this.registry?.addComponent<T>(this, ComponentClass, ...args);
    }

    removeComponent<T extends Component>(ComponentClass: ComponentClass<T>): void {
        this.registry?.removeComponent<T>(this, ComponentClass);
    }

    hasComponent<T extends Component>(ComponentClass: ComponentClass<T>): boolean {
        if (!this.registry) {
            return false;
        }

        return this.registry?.hasComponent<T>(this, ComponentClass);
    }

    getComponent<T extends Component>(ComponentClass: ComponentClass<T>): T | undefined {
        return this.registry?.getComponent<T>(this, ComponentClass);
    }
}
