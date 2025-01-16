import CameraFollowComponent from '../components/CameraFollowComponent.js';
import TransformComponent from '../components/TransformComponent.js';
import System from '../ecs/System.js';
import Game from '../game/Game.js';
import { Rect } from '../types/types.js';

export default class CameraMovementSystem extends System {
    constructor() {
        super();
        this.requireComponent(CameraFollowComponent);
        this.requireComponent(TransformComponent);
    }

    update(camera: Rect) {
        for (const entity of this.getSystemEntities()) {
            const transform = entity.getComponent(TransformComponent);

            if (!transform) {
                throw new Error('Could not find transform component of entity with id ' + entity.getId());
            }

            if (transform.position.x + camera.width / 2 < Game.mapWidth) {
                camera.x = transform.position.x - camera.width / 2;
            }

            if (transform.position.y + camera.height / 2 < Game.mapHeight) {
                camera.y = transform.position.y - camera.height / 2;
            }

            // Keep camera rectangle view inside the screen limits
            camera.x = camera.x < 0 ? 0 : camera.x;
            camera.y = camera.y < 0 ? 0 : camera.y;
            camera.x = camera.x > camera.width ? camera.width : camera.x;
            camera.y = camera.y > camera.height ? camera.height : camera.y;
        }
    }
}
