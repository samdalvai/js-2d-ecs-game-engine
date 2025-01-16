import Entity from '../ecs/Entity.js';
import GameEvent from '../event-bus/GameEvent.js';

export default class CollisionEvent extends GameEvent {
    a: Entity;
    b: Entity;

    constructor(a: Entity, b: Entity) {
        super();
        this.a = a;
        this.b = b;
    }
}
