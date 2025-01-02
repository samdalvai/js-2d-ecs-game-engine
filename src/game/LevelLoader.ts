import chopperSpriteSheet from '../../assets/images/chopper-green-spritesheet.png';
import AssetStore from '../asset-store/AssetStore';
import SpriteComponent from '../components/SpriteComponent';
import Registry from '../ecs/Registry';

export default class LevelLoader {
    public loadLevel(registry: Registry, assetStore: AssetStore) {
        this.loadAssets(assetStore);
        this.loadEntities(registry, assetStore);
    }

    private loadAssets(assetStore: AssetStore) {
        assetStore.addTexture('chopper', chopperSpriteSheet);
    }

    private loadTileMap(registry: Registry, assetStore: AssetStore) {}

    private loadEntities(registry: Registry, assetStore: AssetStore) {
        const player = registry.createEntity();
        player.addComponent(SpriteComponent);
    }
}
