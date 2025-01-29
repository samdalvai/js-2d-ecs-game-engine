import System from '../ecs/System';
import Game from '../game/Game';

export default class RenderMenuSystem extends System {


    update(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, Game.windowWidth, Game.windowHeight);

        ctx.fillStyle = 'gray';
        ctx.fillRect(Game.windowWidth / 2 - 125, Game.windowHeight / 2 - 50, 250, 100);

        ctx.fillStyle = 'white';
        ctx.font = '26px Arial';

        ctx.fillText('Play again', Game.windowWidth / 2 - 60, Game.windowHeight / 2 + 5);
        ctx.restore();
    }
}
