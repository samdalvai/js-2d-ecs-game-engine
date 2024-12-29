import Entity from './Entity';

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
    entities: Set<Entity> = new Set();

    static getId() {
        if (this._id === undefined) {
            this._id = ISystem.nextId++;
        }
        return this._id;
    }

    addEntityToSystem = (entity: Entity) => {
        this.entities.add(entity);
    };

    removeEntityFromSystem = (entity: Entity) => {
        this.entities.delete(entity);
    };
}
