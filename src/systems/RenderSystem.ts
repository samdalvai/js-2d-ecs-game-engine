import SpriteComponent from '../components/SpriteComponent';
import System from '../ecs/System';

export default class RenderSystem extends System {
    constructor() {
        super();
        this.requireComponent(SpriteComponent);
    }

    update(ctx: CanvasRenderingContext2D) {
        for (const entity of this.getSystemEntities()) {
            ctx.fillStyle = 'red';
            ctx.fillRect(100, 100, 50, 50);
        }

        // TODO: render sprite based on position of entity
    }
}
