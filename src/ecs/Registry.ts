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
        console.log('Entity with id ' + entity.id + ' killed');
    };
}
