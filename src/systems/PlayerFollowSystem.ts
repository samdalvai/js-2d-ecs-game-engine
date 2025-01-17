import PlayerFollowComponent from '../components/PlayerFollowComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System';

export default class PlayerFollowSystem extends System {
    constructor() {
        super();
        this.requireComponent(TransformComponent);
        this.requireComponent(PlayerFollowComponent);
        this.requireComponent(RigidBodyComponent);
    }

    update(registry: Registry) {
        const player = registry.getEntityByTag('player');

        if (!player) {
            //throw new Error('Player entity not found');
            return;
        }

        const playerTransform = player.getComponent(TransformComponent);
        const playerSprite = player.getComponent(SpriteComponent);

        if (!playerTransform || !playerSprite) {
            throw new Error('Could not find player transform and/or sprite component');
        }

        for (const entity of this.getSystemEntities()) {
            const transform = entity.getComponent(TransformComponent);
            const rigidBody = entity.getComponent(RigidBodyComponent);
            const playerFollow = entity.getComponent(PlayerFollowComponent);

            if (!rigidBody || !transform || !playerFollow) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            const playerFollowX = transform.position.x + playerFollow.offset.x;
            const playerFollowY = transform.position.y + playerFollow.offset.y;

            const playerX = playerTransform.position.x + (playerTransform.scale.x * playerSprite.width) / 2;
            const playerY = playerTransform.position.y + (playerTransform.scale.y * playerSprite.height) / 2;

            const isPlayerInsideCircle = this.isEntityInsideCircle(
                playerX,
                playerY,
                playerFollowX,
                playerFollowY,
                playerFollow.detectionRadius,
            );

            if (isPlayerInsideCircle) {
                console.log('Detected');
            }
        }
    }

    private isEntityInsideCircle(
        entityX: number,
        entityY: number,
        circleX: number,
        circleY: number,
        circleRadius: number,
    ) {
        return Math.pow(entityX - circleX, 2) + Math.pow(entityY - circleY, 2) <= circleRadius * circleRadius;
    }
}
