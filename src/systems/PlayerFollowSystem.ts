import EntityFollowComponent from '../components/EntityFollowComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System';

const ALIGNMENT_THRESHOLD = 5;
const FOLLOW_PADDING = 50;

/*
How the follow system works:

                |
      P         |         P
                |
--------------------------------
                                    FOLLOW PADDING
---------       E      ---------
                                    FOLLOW PADDING
--------------------------------
                |
      P         |          P
                |

1. If player is outside visibility circle, nothing will happen
2. If player is inside visibility circle but outside min distance
the entity will move on the x axis to align with the player
3. If player is on the same axis but outside min distance 
the enity will move towards the player
4. If player is inside min distance but outside follow padding
for y, the entity will move on the x axis to align
5. If player is inside min distance and inside follow padding
the entity will move on the y axis to align
*/

export default class PlayerFollowSystem extends System {
    constructor() {
        super();
        this.requireComponent(TransformComponent);
        this.requireComponent(EntityFollowComponent);
        this.requireComponent(RigidBodyComponent);
    }

    update(registry: Registry) {
        const player = registry.getEntityByTag('player');

        if (!player) {
            console.log('Player entity not found');
            return;
        }

        const playerTransform = player.getComponent(TransformComponent);
        const playerSprite = player.getComponent(SpriteComponent);

        if (!playerTransform || !playerSprite) {
            throw new Error('Could not find player transform and/or sprite component');
        }

        for (const entity of this.getSystemEntities()) {
            const entityTransform = entity.getComponent(TransformComponent);
            const entityRigidBody = entity.getComponent(RigidBodyComponent);
            const entityPlayerFollow = entity.getComponent(EntityFollowComponent);

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

                // Handle player follow for entities not having a follow velocity
                if (entityPlayerFollow.followVelocity === 0) {
                    if (deltaX > deltaY) {
                        entityRigidBody.direction = { x: playerX < playerFollowX ? -1 : 1, y: 0 };
                    } else {
                        entityRigidBody.direction = { x: 0, y: playerY < playerFollowY ? -1 : 1 };
                    }

                    continue;
                }

                // Handle player follow for entities having a follow velocity
                if (playerX > playerFollowX + ALIGNMENT_THRESHOLD) {
                    // Case 1: player is on the right of the entity
                    if (
                        (deltaY <= ALIGNMENT_THRESHOLD && deltaX > entityPlayerFollow.minFollowDistance) ||
                        deltaY > FOLLOW_PADDING
                    ) {
                        // Case 1a: player is on the horizontal line, move right until entity is at min distance
                        entityRigidBody.velocity = { x: entityPlayerFollow.followVelocity, y: 0 };
                        entityRigidBody.direction = { x: 1, y: 0 };
                    } else if (deltaY <= ALIGNMENT_THRESHOLD && deltaX <= entityPlayerFollow.minFollowDistance) {
                        // Case 1b: player is on the horizontal line and already at min distance, stop
                        entityRigidBody.velocity = { x: 0, y: 0 };
                        entityRigidBody.direction = { x: 1, y: 0 };
                    } else if (deltaY <= FOLLOW_PADDING) {
                        // Case 1c: player is near the horizontal line, move vertically
                        if (playerY < playerFollowY + ALIGNMENT_THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: -1 * entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: -1 };
                        } else if (playerY > playerFollowY - ALIGNMENT_THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: 1 };
                        }
                    }
                } else if (playerX < playerFollowX - ALIGNMENT_THRESHOLD) {
                    // Case 2: player is on the left of the entity
                    if (
                        (deltaY <= ALIGNMENT_THRESHOLD && deltaX > entityPlayerFollow.minFollowDistance) ||
                        deltaY > FOLLOW_PADDING
                    ) {
                        // Case 1a: player is on the horizontal line, move left until entity is at min distance
                        entityRigidBody.velocity = { x: -1 * entityPlayerFollow.followVelocity, y: 0 };
                        entityRigidBody.direction = { x: -1, y: 0 };
                    } else if (deltaY <= ALIGNMENT_THRESHOLD && deltaX <= entityPlayerFollow.minFollowDistance) {
                        // Case 1b: player is on the horizontal line and already at min distance, stop
                        entityRigidBody.velocity = { x: 0, y: 0 };
                        entityRigidBody.direction = { x: -1, y: 0 };
                    } else if (deltaY <= FOLLOW_PADDING) {
                        // Case 1c: player is near the horizontal line, move vertically
                        if (playerY < playerFollowY + ALIGNMENT_THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: -1 * entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: -1 };
                        } else if (playerY > playerFollowY - ALIGNMENT_THRESHOLD) {
                            entityRigidBody.velocity = { x: 0, y: entityPlayerFollow.followVelocity };
                            entityRigidBody.direction = { x: 0, y: 1 };
                        }
                    }
                } else if (playerY < playerFollowY - ALIGNMENT_THRESHOLD) {
                    // Case 3: player is on the top of the entity
                    if (deltaY > entityPlayerFollow.minFollowDistance) {
                        entityRigidBody.velocity = { x: 0, y: -1 * entityPlayerFollow.followVelocity };
                    } else {
                        entityRigidBody.velocity = { x: 0, y: 0 };
                    }
                    entityRigidBody.direction = { x: 0, y: -1 };
                } else if (playerY > playerFollowY + ALIGNMENT_THRESHOLD) {
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
                // entityRigidBody.velocity = { x: 0, y: 0 };
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
