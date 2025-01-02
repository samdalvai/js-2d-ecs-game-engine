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

    update(ctx: CanvasRenderingContext2D, assetStore: AssetStore) {
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

            renderableEntities.push({ sprite, transform });

            // TODO: Cull entities outside camera view
        }

        renderableEntities.sort((entityA, entityB) => {
            return entityA.sprite.zIndex - entityB.sprite.zIndex;
        });

        for (const entity of renderableEntities) {
            const sprite = entity.sprite;
            const transform = entity.transform;

            const srcRect: Rect = sprite.srcRect;

            const dstRect: Rect = {
                x: transform.position.x,
                y: transform.position.y,
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
