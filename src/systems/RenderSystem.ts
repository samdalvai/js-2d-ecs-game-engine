import spriteSheet from '../../assets/images/chopper-green-spritesheet.png';
import SpriteComponent from '../components/SpriteComponent';
import System from '../ecs/System';

export default class RenderSystem extends System {
    image: HTMLImageElement;

    constructor() {
        super();
        this.requireComponent(SpriteComponent);
        this.image = new Image();
        this.image.src = spriteSheet;
    }

    update(ctx: CanvasRenderingContext2D) {
        for (const entity of this.getSystemEntities()) {
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

            // Draw the sprite
            ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }

        // TODO: render sprite based on position of entity
    }
}
