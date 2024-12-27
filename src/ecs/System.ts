import Entity from './Entity';

export default class System {
    entities: Set<Entity> = new Set();

    addEntityToSystem = (entity: Entity) => {
        this.entities.add(entity);
    };

    removeEntityFromSystem = (entity: Entity) => {
        this.entities.delete(entity);
    };
}
