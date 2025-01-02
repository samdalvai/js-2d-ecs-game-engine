import AssetStore from '../asset-store/AssetStore';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import System from '../ecs/System';
import { Rect } from '../types';

export default class RenderSystem extends System {
    constructor() {
        super();
        this.requireComponent(SpriteComponent);
        this.requireComponent(TransformComponent);
    }

    update(ctx: CanvasRenderingContext2D, assetStore: AssetStore, camera: Rect) {
        const renderableEntities: {
            sprite: SpriteComponent;
            transform: TransformComponent;
        }[] = [];

        for (const entity of this.getSystemEntities()) {
            const sprite = entity.getComponent(SpriteComponent);
            const transform = entity.getComponent(TransformComponent);

            if (!sprite) {
                console.error(
                    'Could not find sprite component of entity with id ' + entity.getId(),
                );
                continue;
            }

            if (!transform) {
                console.error(
                    'Could not find transform component of entity with id ' + entity.getId(),
                );
                continue;
            }

            // Check if the entity sprite is outside the camera view
            const isOutsideCameraView =
                transform.position.x + transform.scale.x * sprite.width < camera.x ||
                transform.position.x > camera.x + camera.width ||
                transform.position.y + transform.scale.y * sprite.height < camera.y ||
                transform.position.y > camera.y + camera.height;

            // Cull sprites that are outside the camera viww (and are not fixed)
            if (isOutsideCameraView && !sprite.isFixed) {
                continue;
            }

            renderableEntities.push({ sprite, transform });
        }

        renderableEntities.sort((entityA, entityB) => {
            return entityA.sprite.zIndex - entityB.sprite.zIndex;
        });

        for (const entity of renderableEntities) {
            const sprite = entity.sprite;
            const transform = entity.transform;

            const srcRect: Rect = sprite.srcRect;

            const dstRect: Rect = {
                x: transform.position.x - (sprite.isFixed ? 0 : camera.x),
                y: transform.position.y - (sprite.isFixed ? 0 : camera.y),
                width: sprite.width * transform.scale.x,
                height: sprite.height * transform.scale.y,
            };

            // TODO: handle flipping images and rotation, if possible
            ctx.drawImage(
                assetStore.getTexture(sprite.assetId),
                srcRect.x,
                srcRect.y,
                srcRect.width,
                srcRect.height,
                dstRect.x,
                dstRect.y,
                dstRect.width,
                dstRect.height,
            );
        }
    }
}
