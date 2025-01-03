import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Entity from '../ecs/Entity';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import CollisionEvent from '../events/CollisionEvent';
import { Flip } from '../types';

export default class MovementSystem extends System {
    constructor() {
        super();
        this.requireComponent(TransformComponent);
        this.requireComponent(RigidBodyComponent);
    }

    subscribeToEvents(eventBus: EventBus) {
        eventBus.subscribeToEvent(CollisionEvent, this, this.onCollision);
    }

    onCollision(event: CollisionEvent) {
        const a = event.a;
        const b = event.b;

        if (a.belongsToGroup('enemies') && b.belongsToGroup('obstacles')) {
            this.onEnemyHitsObstacle(a);
        }
        if (a.belongsToGroup('obstacles') && b.belongsToGroup('enemies')) {
            this.onEnemyHitsObstacle(b);
        }

        if (a.hasTag('player') && (b.belongsToGroup('enemies') || b.belongsToGroup('obstacles'))) {
            this.onPlayerHitsEnemyOrObstacle(a);
        }
        if ((a.belongsToGroup('enemies') || a.belongsToGroup('obstacles')) && b.hasTag('player')) {
            this.onPlayerHitsEnemyOrObstacle(b);
        }
    }

    onEnemyHitsObstacle(enemy: Entity) {
        if (enemy.hasComponent(RigidBodyComponent) && enemy.hasComponent(SpriteComponent)) {
            const rigidbody = enemy.getComponent(RigidBodyComponent);
            const sprite = enemy.getComponent(SpriteComponent);

            if (!rigidbody) {
                throw new Error('Could not find rigidbody component of entity with id ' + enemy.getId());
            }

            if (!sprite) {
                throw new Error('Could not find sprite component of entity with id ' + enemy.getId());
            }

            if (rigidbody.velocity.x != 0) {
                rigidbody.velocity.x *= -1;
                sprite.flip = sprite.flip === Flip.NONE ? Flip.HORIZONTAL : Flip.NONE;
            }

            if (rigidbody.velocity.y != 0) {
                rigidbody.velocity.y *= -1;
                sprite.flip = sprite.flip === Flip.NONE ? Flip.VERTICAL : Flip.NONE;
            }
        }
    }

    onPlayerHitsEnemyOrObstacle(player: Entity) {
        if (player.hasComponent(RigidBodyComponent) && player.hasComponent(TransformComponent)) {
            const rigidbody = player.getComponent(RigidBodyComponent);
            const transform = player.getComponent(TransformComponent);

            if (!rigidbody) {
                throw new Error('Could not find rigidbody component of entity with id ' + player.getId());
            }

            if (!transform) {
                throw new Error('Could not find transform component of entity with id ' + player.getId());
            }

            // Move player some pixels back on collision to avoid being stuck
            if (rigidbody.velocity.x > 0) {
                transform.position.x -= 10.0;
            }

            if (rigidbody.velocity.x < 0) {
                transform.position.x += 10.0;
            }

            if (rigidbody.velocity.y > 0) {
                transform.position.y -= 10.0;
            }

            if (rigidbody.velocity.y < 0) {
                transform.position.y += 10.0;
            }

            rigidbody.velocity = { x: 0, y: 0 };
        }
    }

    update(deltaTime: number, mapWidth: number, mapHeight: number) {
        for (const entity of this.getSystemEntities()) {
            const transform = entity.getComponent(TransformComponent);
            const rigidBody = entity.getComponent(RigidBodyComponent);

            if (!transform) {
                throw new Error('Could not find transform component of entity with id ' + entity.getId());
            }

            if (!rigidBody) {
                throw new Error('Could not find rigidBody component of entity with id ' + entity.getId());
            }

            transform.position.x += rigidBody.velocity.x * deltaTime;
            transform.position.y += rigidBody.velocity.y * deltaTime;

            if (entity.hasTag('player')) {
                const paddingLeft = 10;
                const paddingTop = 10;
                const paddingRight = 50;
                const paddingBottom = 50;
                transform.position.x = transform.position.x < paddingLeft ? paddingLeft : transform.position.x;
                transform.position.x =
                    transform.position.x > mapWidth - paddingRight ? mapWidth - paddingRight : transform.position.x;
                transform.position.y = transform.position.y < paddingTop ? paddingTop : transform.position.y;
                transform.position.y =
                    transform.position.y > mapHeight - paddingBottom ? mapHeight - paddingBottom : transform.position.y;
            }

            const cullingMargin = 100;

            const isEntityOutsideMap =
                transform.position.x < -cullingMargin ||
                transform.position.x > mapWidth + cullingMargin ||
                transform.position.y < -cullingMargin ||
                transform.position.y > mapHeight + cullingMargin;

            // Kill all entities that move outside the map boundaries
            if (isEntityOutsideMap && !entity.hasTag('player')) {
                entity.kill();
            }
        }
    }
}
