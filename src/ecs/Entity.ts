import Component from './Component';
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
        ComponentClass: new (...args: any[]) => T,
        ...args: ConstructorParameters<typeof ComponentClass>
    ): void {
        const component = new ComponentClass(...args);
    }

    removeComponent<T extends Component>(): void {}

    hasComponent<T extends Component>(): boolean {
        return false;
    }

    getComponent<T extends Component>(): T | undefined {
        return undefined;
    }
}
