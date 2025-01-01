import AssetStore from '../asset-store/AssetStore';
import SpriteComponent from '../components/SpriteComponent';
import System from '../ecs/System';

export default class RenderSystem extends System {

    constructor() {
        super();
        this.requireComponent(SpriteComponent);
    }

    update(ctx: CanvasRenderingContext2D, assetStore: AssetStore) {
        for (const _ of this.getSystemEntities()) {
            // Define the sprite details
            const spriteWidth = 32; // Width of one sprite
            const spriteHeight = 32; // Height of one sprite
            const spriteX = 0; // Column of the sprite (0-indexed)
            const spriteY = 0; // Row of the sprite (0-indexed)

            // Calculate source rectangle
            const sx = spriteX * spriteWidth;
            const sy = spriteY * spriteHeight;
            const sWidth = spriteWidth;
            const sHeight = spriteHeight;

            // Define destination rectangle on the canvas
            const dx = 100; // X position on canvas
            const dy = 100; // Y position on canvas
            const dWidth = spriteWidth;
            const dHeight = spriteHeight;

            const image = assetStore.getTexture('chopper');

            // Draw the sprite
            ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }

        // TODO: render sprite based on position of entity
    }
}
