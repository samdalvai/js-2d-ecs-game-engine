import BoxColliderComponent from '../components/BoxColliderComponent';
import TransformComponent from '../components/TransformComponent';
import System from '../ecs/System';
import { Rect } from '../types';

export default class RenderColliderSystem extends System {
    constructor() {
        super();
        this.requireComponent(TransformComponent);
        this.requireComponent(BoxColliderComponent);
    }

    update(ctx: CanvasRenderingContext2D, camera: Rect) {
        for (const entity of this.getSystemEntities()) {
            const transform = entity.getComponent(TransformComponent);
            const collider = entity.getComponent(BoxColliderComponent);

            if (!transform) {
                throw new Error('Could not find transform component of entity with id ' + entity.getId());
            }

            if (!collider) {
                throw new Error('Could not find collider component of entity with id ' + entity.getId());
            }

            // Bypass rendering if entities are outside the camera view
            const isOutsideCameraView =
                transform.position.x + transform.scale.x * collider.width < camera.x ||
                transform.position.x > camera.x + camera.width ||
                transform.position.y + transform.scale.y * collider.height < camera.y ||
                transform.position.y > camera.y + camera.height;

            if (isOutsideCameraView) {
                continue;
            }

            const colliderRect: Rect = {
                x: transform.position.x + collider.offset.x - camera.x,
                y: transform.position.y + collider.offset.y - camera.y,
                width: collider.width * transform.scale.x,
                height: collider.height * transform.scale.y,
            };

            ctx.strokeStyle = 'red';
            ctx.strokeRect(colliderRect.x, colliderRect.y, colliderRect.width, colliderRect.height);
        }
    }
}
