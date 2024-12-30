import Component, { ComponentClass } from './Component';
import Entity from './Entity';
import Pool, { IPool } from './Pool';
import Signature from './Signature';
import System, { SystemClass } from './System';

export default class Registry {
    numEntities;

    // [Array index = component type id]
    // [Pool index = entity id]
    componentPools: IPool[];

    // [Array index = entity id]
    entityComponentSignatures: Signature[];

    systems: Map<number, System>;

    entitiesToBeAdded: Set<Entity>;
    entitiesToBeKilled: Set<Entity>;
    freeIds: number[];

    constructor() {
        this.numEntities = 0;
        this.componentPools = [];
        this.entityComponentSignatures = [];
        this.systems = new Map<number, System>();
        this.entitiesToBeAdded = new Set();
        this.entitiesToBeKilled = new Set();
        this.freeIds = [];
    }

    update = () => {};

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

    addComponent<T extends Component>(
        entity: Entity,
        ComponentClass: ComponentClass<T>,
        ...args: ConstructorParameters<typeof ComponentClass>
    ) {
        const componentId = ComponentClass.getId();
        const entityId = entity.getId();

        if (this.componentPools[componentId] === undefined) {
            const newComponentPool = new Pool<T>();
            this.componentPools[componentId] = newComponentPool;
        }

        const newComponent = new ComponentClass(...args);
        const componentPool = this.componentPools[componentId] as Pool<T>;
        componentPool?.set(entityId, newComponent);

        this.entityComponentSignatures[entityId].set(componentId);
        console.log(
            'Component with id ' + componentId + ' was added to entity with id ' + entityId,
        );
    }

    removeComponent<T extends Component>(entity: Entity, ComponentClass: ComponentClass<T>) {
        const componentId = ComponentClass.getId();
        const entityId = entity.getId();

        // Remove the component from the component list for that entity
        const componentPool = this.componentPools[componentId] as Pool<T>;
        componentPool?.remove(entityId);

        // Set this component signature for that entity to false
        this.entityComponentSignatures[entityId].remove(componentId);

        console.log('Component with id ' + componentId + ' was removed from entity id ' + entityId);
    }

    hasComponent<T extends Component>(entity: Entity, ComponentClass: ComponentClass<T>): boolean {
        const componentId = ComponentClass.getId();
        const entityId = entity.getId();
        return this.entityComponentSignatures[entityId].test(componentId);
    }

    getComponent<T extends Component>(
        entity: Entity,
        ComponentClass: ComponentClass<T>,
    ): T | undefined {
        const componentId = ComponentClass.getId();
        const entityId = entity.getId();

        const componentPool = this.componentPools[componentId] as Pool<T>;
        return componentPool?.get(entityId);
    }

    addSystem<T extends System>(
        SystemClass: SystemClass<T>,
        ...args: ConstructorParameters<typeof SystemClass>
    ) {
        const newSystem = new SystemClass(...args);
        this.systems.set(SystemClass.getId(), newSystem);
    }

    removeSystem<T extends System>(SystemClass: SystemClass<T>) {
        this.systems.delete(SystemClass.getId());
    }

    hasSystem<T extends System>(SystemClass: SystemClass<T>): boolean {
        return this.systems.get(SystemClass.getId()) !== undefined;
    }

    getSystem<T extends System>(SystemClass: SystemClass<T>): T | undefined {
        const system = this.systems.get(SystemClass.getId());

        if (system === undefined) {
            return undefined;
        }

        return system as T;
    }

    addEntityToSystems(entity: Entity) {
        // TODO...
    }
    removeEntityFromSystems(entity: Entity) {
        // TODO...
    }
}
