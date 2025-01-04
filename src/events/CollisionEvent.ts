import Entity from '../ecs/Entity';
import GameEvent from '../event-bus/GameEvent';
import { Vec2 } from '../types';

export default class CollisionEvent extends GameEvent {
    a: Entity;
    b: Entity;
    collisionNormal: Vec2;

    constructor(a: Entity, b: Entity, collisionNormal = { x: 0, y: 0 }) {
        super();
        this.a = a;
        this.b = b;
        this.collisionNormal = collisionNormal;
    }
}
