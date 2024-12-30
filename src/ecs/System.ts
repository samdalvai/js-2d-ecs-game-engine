import Component, { ComponentClass } from './Component';
import Entity from './Entity';
import Signature from './Signature';

export type SystemClass<T extends System> = {
    new (...args: any[]): T;
    getId(): number;
};

export class ISystem {
    static nextId = 0;

    static resetIds(): void {
        this.nextId = 0;
    }
}

export default class System extends ISystem {
    private static _id?: number;
    private componentSignature: Signature;
    private entities: Entity[];

    constructor() {
        super();
        this.componentSignature = new Signature();
        this.entities = [];
    }

    static getId() {
        if (this._id === undefined) {
            this._id = ISystem.nextId++;
        }
        return this._id;
    }

    addEntityToSystem = (entity: Entity) => {
        this.entities.push(entity);
    };

    removeEntityFromSystem = (entity: Entity) => {
        const entityIndex = this.entities.indexOf(entity);
        const lastElementIndex = this.entities.length - 1;
        this.entities[entityIndex] = this.entities[lastElementIndex];
        this.entities.splice(lastElementIndex, 1);
    };

    getSystemEntities() {
        return this.entities;
    }

    getComponentSignature() {
        return this.componentSignature;
    }

    requireComponent<T extends Component>(ComponentClass: ComponentClass<T>) {
        const componentId = ComponentClass.getId();
        this.componentSignature.set(componentId);
    }
}
