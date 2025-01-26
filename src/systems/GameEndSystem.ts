import HealthComponent from '../components/HealthComponent';
import TextLabelComponent from '../components/TextLabelComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System';
import Game from '../game/Game';
import { GameStatus } from '../types';

export default class GameEndSystem extends System {
    constructor() {
        super();
        this.requireComponent(HealthComponent);
    }

    update(registry: Registry) {
        let numberOfEnemies = 0;
        let isPlayerAlive = false;

        for (const entity of this.getSystemEntities()) {
            if (entity.belongsToGroup('enemies')) {
                numberOfEnemies++;
            }

            if (entity.hasTag('player')) {
                isPlayerAlive = true;
            }
        }

        if (numberOfEnemies == 0 && Game.gameStatus !== GameStatus.WON) {
            Game.gameStatus = GameStatus.WON;
            const label = registry.createEntity();
            const color = { r: 100, g: 255, b: 100 };
            label.addComponent(
                TextLabelComponent,
                { x: Game.windowWidth / 2 - 50, y: Game.windowHeight / 2 },
                'Game won!!',
                color,
                true,
                '35px Arial',
            );
            return;
        }

        if (!isPlayerAlive && Game.gameStatus !== GameStatus.LOST) {
            Game.gameStatus = GameStatus.LOST;
            const label = registry.createEntity();
            const color = { r: 255, g: 50, b: 50 };
            label.addComponent(
                TextLabelComponent,
                { x: Game.windowWidth / 2 - 50, y: Game.windowHeight / 2 },
                'Game lost!',
                color,
                true,
                '35px Arial',
            );
        }
    }
}
