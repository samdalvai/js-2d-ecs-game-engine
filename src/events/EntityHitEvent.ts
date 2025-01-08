import Entity from '../ecs/Entity';
import GameEvent from '../event-bus/GameEvent';
import { Vec2 } from '../types/types';

export default class EntityHitEvent extends GameEvent {
    entity: Entity;
    hitPosition: Vec2;

    constructor(entity: Entity, hitPosition: Vec2) {
        super();
        this.hitPosition = hitPosition;
        this.entity = entity;
    }
}
