import chopperSpriteSheet from '../../assets/images/chopper-green-spritesheet.png';
import AssetStore from '../asset-store/AssetStore';

export default class LevelLoader {
    public loadLevel(assetStore: AssetStore) {
        this.loadAssets(assetStore);
    }

    private loadAssets(assetStore: AssetStore) {
        assetStore.addTexture('chopper', chopperSpriteSheet);
    }
}
