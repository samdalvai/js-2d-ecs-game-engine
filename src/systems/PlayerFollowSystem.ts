import PlayerFollowComponent from '../components/PlayerFollowComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System'

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
            throw new Error('Player entity not found');
        }

        const playerTransform = player.getComponent(TransformComponent);
        const playerSprite = player.getComponent(SpriteComponent);

        if (!playerTransform || !playerSprite) {
            throw new Error('Could not find player transform and/or sprite component');
        }

        for (const entity of this.getSystemEntities()) {
            const entityTransform = entity.getComponent(TransformComponent);
            const entityRigidBody = entity.getComponent(RigidBodyComponent);
            const entityPlayerFollow = entity.getComponent(PlayerFollowComponent);

            if (!entityRigidBody || !entityTransform || !entityPlayerFollow) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            const playerFollowX = entityTransform.position.x + entityPlayerFollow.offset.x;
            const playerFollowY = entityTransform.position.y + entityPlayerFollow.offset.y;

            const playerX = playerTransform.position.x + (playerTransform.scale.x * playerSprite.width) / 2;
            const playerY = playerTransform.position.y + (playerTransform.scale.y * playerSprite.height) / 2;

            const isPlayerInsideCircle = this.isEntityInsideCircle(
                playerX,
                playerY,
                playerFollowX,
                playerFollowY,
                entityPlayerFollow.detectionRadius,
            );

            if (isPlayerInsideCircle) {
                const deltaX = Math.abs(playerX - playerFollowX);
                const deltaY = Math.abs(playerY - playerFollowY);

                const THRESHOLD = 5;
                const PADDING = 50;

                if (playerX > playerFollowX + THRESHOLD) {
                    // Case 1: player is on the right of the entity
                    if (deltaY <= THRESHOLD && deltaX > entityPlayerFollow.minFollowDistance) {
                        // Case 1a: player is on the horizontal line, move right until entity is at min distance
                        entityRigidBody.velocity = { x: entityPlayerFollow.followVelocity, y: 0 };
                        entityRigidBody.direction = { x: 1, y: 0 };
                    } else if (deltaY <= THRESHOLD && deltaX <= entityPlayerFollow.minFollowDistance) {
                        // Case 1b: player is on the horizontal line and already at min distance, stop
                        entityRigidBody.velocity = { x: 0, y: 0 };
                        entityRigidBody.direction = { x: 1, y: 0 };
                    } else if (deltaY > PADDING) {
                        // Case 1c: player is not at horizontal line by some padding, move right
                        entityRigidBody.velocity = { x: entityPlayerFollow.followVelocity, y: 0 };
                        entityRigidBody.direction = { x: 1, y: 0 };
                    } else if (deltaY <= PADDING) {
                        if (playerY < playerFollowY + THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: -1 * entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: -1 };
                        } else if (playerY > playerFollowY - THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: 1 };
                        }
                    }
                } else if (playerX < playerFollowX - THRESHOLD) {
                    // Case 2: player is on the left of the entity
                    if (deltaY <= THRESHOLD && deltaX > entityPlayerFollow.minFollowDistance) {
                        // Case 1a: player is on the horizontal line, move left until entity is at min distance
                        entityRigidBody.velocity = { x: -1 * entityPlayerFollow.followVelocity, y: 0 };
                        entityRigidBody.direction = { x: -1, y: 0 };
                    } else if (deltaY <= THRESHOLD && deltaX <= entityPlayerFollow.minFollowDistance) {
                        // Case 1b: player is on the horizontal line and already at min distance, stop
                        entityRigidBody.velocity = { x: 0, y: 0 };
                        entityRigidBody.direction = { x: -1, y: 0 };
                    } else if (deltaY > PADDING) {
                        // Case 1c: player is not at horizontal line by some padding, move left
                        entityRigidBody.velocity = { x: -1 * entityPlayerFollow.followVelocity, y: 0 };
                        entityRigidBody.direction = { x: -1, y: 0 };
                    } else if (deltaY <= PADDING) {
                        if (playerY < playerFollowY + THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: -1 * entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: -1 };
                        } else if (playerY > playerFollowY - THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: 1 };
                        }
                    }
                } else if (playerY < playerFollowY - THRESHOLD) {
                    // Case 3: player is on the top of the entity
                    if (deltaY > entityPlayerFollow.minFollowDistance) {
                        entityRigidBody.velocity = { x: 0, y: -1 * entityPlayerFollow.followVelocity };
                    } else {
                        entityRigidBody.velocity = { x: 0, y: 0 };
                    }
                    entityRigidBody.direction = { x: 0, y: -1 };
                } else if (playerY > playerFollowY + THRESHOLD) {
                    // Case 4: player is on the bottom of the entity
                    if (deltaY > entityPlayerFollow.minFollowDistance) {
                        entityRigidBody.velocity = { x: 0, y: entityPlayerFollow.followVelocity };
                    } else {
                        entityRigidBody.velocity = { x: 0, y: 0 };
                    }
                    entityRigidBody.direction = { x: 0, y: 1 };
                } else {
                    entityRigidBody.velocity = { x: 0, y: 0 };
                }
            } else {
                // TODO: revert to previous velocity if entity has script (to be implemented)
                entityRigidBody.velocity = { x: 0, y: 0 };
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

    private getDistanceFromPlayer(x: number, y: number, x0: number, y0: number) {
        // Calculate the squared distance between the point and the circle's center
        const dx = x - x0;
        const dy = y - y0;
        const distanceSquared = dx ** 2 + dy ** 2;

        // Calculate the actual distance
        const distance = Math.sqrt(distanceSquared);

        return distance;
    }
}
