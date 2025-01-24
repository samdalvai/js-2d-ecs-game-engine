import PlayerFollowComponent from '../components/PlayerFollowComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System';
import { Vector } from '../types';

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
                const directionVector = this.computeRotatedVector(
                    playerFollowX,
                    playerFollowY,
                    playerX,
                    playerY,
                    entityPlayerFollow.followVelocity,
                );

                const deltaX = Math.abs(playerX - playerFollowX);
                const deltaY = Math.abs(playerY - playerFollowY);

                console.log('deltaX: ', deltaX);
                console.log('deltaY: ', deltaY);
                const THRESHOLD = 1; // Small value to reduce flickering

                if (deltaX > THRESHOLD) {
                    // Attempt to align x axis
                    entityRigidBody.velocity = {
                        x:
                            directionVector.x > 0
                                ? entityPlayerFollow.followVelocity
                                : -1 * entityPlayerFollow.followVelocity,
                        y: 0,
                    };
                    entityRigidBody.direction = { x: directionVector.x > 0 ? 1 : -1, y: 0 };
                } else if (deltaY > THRESHOLD) {
                    // Attempt to align y axis
                    entityRigidBody.velocity = {
                        x: 0,
                        y:
                            directionVector.y > 0
                                ? entityPlayerFollow.followVelocity
                                : -1 * entityPlayerFollow.followVelocity,
                    };
                    entityRigidBody.direction = { x: 0, y: directionVector.y > 0 ? 1 : -1 };
                } else {
                    entityRigidBody.velocity = { x: 0, y: 0 };
                }

                // const distance = this.getDistanceFromPlayer(playerFollowX, playerFollowY, playerX, playerY);

                // const directionVector = this.computeRotatedVector(
                //     playerFollowX,
                //     playerFollowY,
                //     playerX,
                //     playerY,
                //     entityPlayerFollow.followVelocity,
                // );

                // if (distance >= entityPlayerFollow.minFollowDistance) {
                //     entityRigidBody.velocity = directionVector;
                // } else {
                //     entityRigidBody.velocity = { x: 0, y: 0 };
                // }

                // // Use a threshold to stabilize direction switching
                // const absX = Math.abs(directionVector.x);
                // const absY = Math.abs(directionVector.y);
                // const THRESHOLD = 0.1; // Small value to reduce flickering

                // if (absX > absY + THRESHOLD) {
                //     entityRigidBody.direction = { x: directionVector.x > 0 ? 1 : -1, y: 0 };
                // } else if (absY > absX + THRESHOLD) {
                //     entityRigidBody.direction = { x: 0, y: directionVector.y > 0 ? 1 : -1 };
                // }
                // If differences are too small, keep the last direction
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

    private computeRotatedVector(x0: number, y0: number, x1: number, y1: number, velocity: number): Vector {
        const dirX = x1 - x0;
        const dirY = y1 - y0;

        // Calculate magnitude of the direction vector
        const magnitude = Math.sqrt(dirX ** 2 + dirY ** 2);
        if (magnitude === 0) {
            throw new Error('The target point is the same as the center of the circle.');
        }

        // Normalize the direction vector
        const unitX = dirX / magnitude;
        const unitY = dirY / magnitude;

        // Scale to the desired length
        const vectorX = unitX * velocity;
        const vectorY = unitY * velocity;

        return { x: vectorX, y: vectorY };
    }
}
