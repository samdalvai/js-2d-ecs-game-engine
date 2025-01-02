import RigidBodyComponent from '../components/RigidBodyComponent';
import TransformComponent from '../components/TransformComponent';
import System from '../ecs/System';
import Game from '../game/Game';

export default class MovementSystem extends System {
    constructor() {
        super();
        this.requireComponent(TransformComponent);
        this.requireComponent(RigidBodyComponent);
    }

    update(deltaTime: number) {
        for (const entity of this.getSystemEntities()) {
            const transform = entity.getComponent(TransformComponent);
            const rigidBody = entity.getComponent(RigidBodyComponent);

            if (!transform) {
                console.error(
                    'Could not find transform component of entity with id ' + entity.getId(),
                );
                continue;
            }

            if (!rigidBody) {
                console.error(
                    'Could not find rigidBody component of entity with id ' + entity.getId(),
                );
                continue;
            }

            transform.position.x += rigidBody.velocity.x * deltaTime;
            transform.position.y += rigidBody.velocity.y * deltaTime;

            // TODO: prevent the main player from moving outside the map boundaries
            // ...

            const cullingMargin = 100;

            const isEntityOutsideMap =
                transform.position.x < -cullingMargin ||
                transform.position.x > Game.mapWidth + cullingMargin ||
                transform.position.y < -cullingMargin ||
                transform.position.y > Game.mapHeight + cullingMargin;

            // Kill all entities that move outside the map boundaries
            if (isEntityOutsideMap) {
                entity.kill();
            }
        }
    }
}
