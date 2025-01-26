import System from '../ecs/System';
import Game from '../game/Game';

export default class RenderFpsSystem extends System {
    constructor() {
        super();
    }

    update(ctx: CanvasRenderingContext2D, currentFPS: number) {
        const x = Game.windowWidth - 260;
        const y = 50;

        ctx.save();

        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Current FPS: (${currentFPS.toFixed(2)})`, x, y);

        ctx.restore();
    }
}
