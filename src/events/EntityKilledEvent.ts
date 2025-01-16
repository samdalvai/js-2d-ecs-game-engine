import Entity from '../ecs/Entity.js';
import GameEvent from '../event-bus/GameEvent.js';

export default class EntityKilledEvent extends GameEvent {
    entity: Entity;

    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }
}
