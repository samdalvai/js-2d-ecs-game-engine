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
                throw new Error('Could not find sprite component of entity with id ' + entity.getId());
            }

            if (!transform) {
                throw new Error('Could not find transform component of entity with id ' + entity.getId());
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

            // Handle rotation of sprites
            if (transform.rotation !== 0) {
                ctx.save();

                const centerX = dstRect.x + dstRect.width / 2;
                const centerY = dstRect.y + dstRect.height / 2;
                ctx.translate(centerX, centerY);

                const radians = transform.rotation * (Math.PI / 180);
                ctx.rotate(radians);

                ctx.drawImage(
                    assetStore.getTexture(sprite.assetId),
                    srcRect.x,
                    srcRect.y,
                    srcRect.width,
                    srcRect.height,
                    -dstRect.width / 2,
                    -dstRect.height / 2,
                    dstRect.width,
                    dstRect.height,
                );

                ctx.restore();
                continue;
            }

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
