import Entity from '../ecs/Entity.js';
import GameEvent from '../event-bus/GameEvent.js';
import { Vec2 } from '../types/types.js';

export default class EntityHitEvent extends GameEvent {
    entity: Entity;
    hitPosition: Vec2;

    constructor(entity: Entity, hitPosition: Vec2) {
        super();
        this.hitPosition = hitPosition;
        this.entity = entity;
    }
}
