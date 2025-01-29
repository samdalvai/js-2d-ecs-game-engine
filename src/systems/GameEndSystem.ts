import HealthComponent from '../components/HealthComponent';
import System from '../ecs/System';
import Game from '../game/Game';
import { GameStatus } from '../types';

export default class GameEndSystem extends System {
    constructor() {
        super();
        this.requireComponent(HealthComponent);
    }

    update() {
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
            return;
        }

        if (!isPlayerAlive && Game.gameStatus !== GameStatus.LOST) {
            Game.gameStatus = GameStatus.LOST;
        }
    }
}
