import chopperSpriteSheet from '../../assets/images/chopper-green-spritesheet.png';
import tankSpriteSheet from '../../assets/images/tank-panther-spritesheet.png';
import AssetStore from '../asset-store/AssetStore';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';

export default class LevelLoader {
    public loadLevel(registry: Registry, assetStore: AssetStore) {
        this.loadAssets(assetStore);
        this.loadEntities(registry);
    }

    private loadAssets(assetStore: AssetStore) {
        assetStore.addTexture('chopper-texture', chopperSpriteSheet);
        assetStore.addTexture('tank-texture', tankSpriteSheet);
    }

    private loadTileMap(registry: Registry) {}

    private loadEntities(registry: Registry) {
        const player = registry.createEntity();
        player.addComponent(SpriteComponent, 'chopper-texture', 32, 32, 1, 0, 0);
        player.addComponent(TransformComponent, { x: 100, y: 100 }, { x: 1, y: 1 }, 0);

        const enemy = registry.createEntity();
        enemy.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 0);
        enemy.addComponent(TransformComponent, { x: 200, y: 200 }, { x: 1, y: 1 }, 0);
    }
}
