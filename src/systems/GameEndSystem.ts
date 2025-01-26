import HealthComponent from '../components/HealthComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System';

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

        // if (numberOfEnemies == 0 && Game::gameStatus != WON) {
        //     Game::gameStatus = WON;
        //     Logger::Log("Player has won!");
        //     Entity label = registry->CreateEntity();
        //     SDL_Color color = { 100, 255, 100};
        //     label.AddComponent<TextLabelComponent>(glm::vec2(Game::windowWidth / 2 - 50, Game::windowHeight / 2), "Game won!!", "charriot-font-xl", color, true);
        //     return;
        // }

        // if (!isPlayerAlive && Game::gameStatus != LOST) {
        //     Game::gameStatus = LOST;
        //     Logger::Log("Player has lost!");
        //     Entity label = registry->CreateEntity();
        //     SDL_Color color = { 255, 50, 50};
        //     label.AddComponent<TextLabelComponent>(glm::vec2(Game::windowWidth / 2 - 50, Game::windowHeight / 2), "Game lost!", "charriot-font-xl", color, true);
        // }
    }
}
