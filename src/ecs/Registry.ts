import Component, { ComponentClass } from './Component';
import Entity from './Entity';
import Signature from './Signature';

export default class Registry {
    numEntities = 0;
    entityComponentSignatures: Signature[] = [];

    entitiesToBeAdded: Set<Entity> = new Set();
    entitiesToBeKilled: Set<Entity> = new Set();
    freeIds: number[] = [];

    constructor() {
        // TODO...
    }

    update = () => {};

    // Entity management

    createEntity = (): Entity => {
        let entityId;

        if (this.freeIds.length === 0) {
            entityId = this.numEntities++;
            if (entityId >= this.entityComponentSignatures.length) {
                this.entityComponentSignatures[entityId] = new Signature();
            }
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

    // Component management

    addComponent<T extends Component>(
        entity: Entity,
        ComponentClass: ComponentClass<T>,
        ...args: ConstructorParameters<typeof ComponentClass>
    ) {
        const componentId = ComponentClass.getId();
        const entityId = entity.getId();

        // TODO: add component to component pool
        const component = new ComponentClass(...args);
        console.log('New component: ', component);

        this.entityComponentSignatures[entityId].set(componentId);
        console.log('Component with id ' + componentId + ' was added to entity with id ' + entityId);
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

    // System management

    addEntityToSystems(entity: Entity) {
        // TODO...
    }
    removeEntityFromSystems(entity: Entity) {
        // TODO...
    }
}
