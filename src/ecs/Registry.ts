import Component, { ComponentClass } from './Component';
import Entity from './Entity';

export default class Registry {
    numEntities = 0;
    entitiesToBeAdded: Set<Entity> = new Set();
    entitiesToBeKilled: Set<Entity> = new Set();
    freeIds: number[] = [];

    constructor() {
        // TODO...
    }

    update = () => {};

    createEntity = (): Entity => {
        let entityId;

        if (this.freeIds.length === 0) {
            entityId = this.numEntities++;
        } else {
            entityId = this.freeIds.pop() as number;
        }

        const entity = new Entity(entityId);
        entity.registry = this;
        this.entitiesToBeAdded.add(entity);
        console.log('Entity created with id ' + entityId);

        return entity;
    };

    killEntity = (entity: Entity) => {
        this.entitiesToBeKilled.add(entity);
        console.log('Entity with id ' + entity.getId() + ' killed');
    };

    addComponent<T extends Component>(
        entity: Entity,
        ComponentClass: ComponentClass<T>,
        ...args: ConstructorParameters<typeof ComponentClass>
    ) {
        const comp = new ComponentClass(...args);
        const id = ComponentClass.getId()
        console.log("new comp: ", comp)
        console.log("id: ", id)
    }

    removeComponent<T extends Component>(entity: Entity, ComponentClass: ComponentClass<T>) {}

    hasComponent<T extends Component>(entity: Entity, ComponentClass: ComponentClass<T>): boolean {
        return false;
    }

    getComponent<T extends Component>(
        entity: Entity,
        ComponentClass: ComponentClass<T>,
    ): T | undefined {
        return undefined;
    }

    addEntityToSystems(entity: Entity) {
        // TODO...
    }
    removeEntityFromSystems(entity: Entity) {
        // TODO...
    }
}
