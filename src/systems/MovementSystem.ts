import BoxColliderComponent from '../components/BoxColliderComponent';
import KeyboardControlComponent from '../components/KeyboardControlComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Entity from '../ecs/Entity';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import CollisionEvent from '../events/CollisionEvent';
import { Flip, Vec2 } from '../types';

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
        const collisionNormal = event.collisionNormal;

        if ((a.hasTag('player') || a.belongsToGroup('enemies')) && b.belongsToGroup('obstacles')) {
            this.onEntityHitsObstacle(a, b, collisionNormal);
        }

        if (a.belongsToGroup('obstacles') && (b.hasTag('player') || b.belongsToGroup('enemies'))) {
            // Invert collision to ensure that the vector direction is always related
            // to the "non obstacle" entity
            this.invertCollisionNormal(collisionNormal);
            this.onEntityHitsObstacle(b, a, collisionNormal);
        }

        if (a.hasTag('player') && b.belongsToGroup('enemies')) {
            this.onEntityHitsObstacle(a, b, collisionNormal);
        }

        if (a.belongsToGroup('enemies') && b.hasTag('player')) {
            this.invertCollisionNormal(collisionNormal);
            this.onEntityHitsObstacle(b, a, collisionNormal);
        }
    }

    invertCollisionNormal(collisionNormal: Vec2) {
        collisionNormal.x *= -1;
        collisionNormal.y *= -1;
    }

    onEntityHitsObstacle(entity: Entity, obstacle: Entity, collisionNormal: Vec2) {
        if (entity.hasComponent(RigidBodyComponent) && entity.hasComponent(TransformComponent)) {
            const entityRigidBody = entity.getComponent(RigidBodyComponent);
            const entityTransform = entity.getComponent(TransformComponent);
            const entityCollider = entity.getComponent(BoxColliderComponent);

            const obstacleTransform = obstacle.getComponent(TransformComponent);
            const obstacleCollider = obstacle.getComponent(BoxColliderComponent);

            let keyboardControl = entity.getComponent(KeyboardControlComponent);
            console.log('keyboard control before: ', keyboardControl);

            if (!entityRigidBody || !entityTransform || !entityCollider) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            if (!obstacleTransform || !obstacleCollider) {
                throw new Error('Could not find some component(s) of entity with id ' + obstacle.getId());
            }

            // Entity is colliding downwards, shift up by the height of the player entityCollider
            if (collisionNormal.y < 0) {
                entityTransform.position.y =
                    obstacleTransform.position.y -
                    entityCollider.height * entityTransform.scale.y +
                    obstacleCollider.offset.y -
                    entityCollider.offset.y;
                entityRigidBody.velocity.y = 0;
            }

            // Entity is colliding upwards, shift down by the height of the ground entityCollider
            if (collisionNormal.y > 0) {
                entityTransform.position.y =
                    obstacleTransform.position.y +
                    obstacleCollider.height * obstacleTransform.scale.y +
                    obstacleCollider.offset.y -
                    entityCollider.offset.y;
                entityRigidBody.velocity.y = 0;
            }

            // Entity is colliding on the right, shift left by width of player entityCollider
            if (collisionNormal.x < 0) {
                entityTransform.position.x =
                    obstacleTransform.position.x -
                    entityCollider.width * entityTransform.scale.x +
                    obstacleCollider.offset.x -
                    entityCollider.offset.x;
                entityRigidBody.velocity.x = 0;
            }

            // Entity is colliding on the left, shift right by width of ground entityCollider
            if (collisionNormal.x > 0) {
                entityTransform.position.x =
                    obstacleTransform.position.x +
                    obstacleCollider.width * obstacleTransform.scale.x +
                    obstacleCollider.offset.x -
                    entityCollider.offset.x;
                entityRigidBody.velocity.x = 0;
            }

            keyboardControl = entity.getComponent(KeyboardControlComponent);
            console.log('keyboard control after: ', keyboardControl);
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
