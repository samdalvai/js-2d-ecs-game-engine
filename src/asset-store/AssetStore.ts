export default class AssetStore {
    private textures: Map<string, HTMLImageElement>;
    private sounds: Map<string, HTMLAudioElement>;

    constructor() {
        this.textures = new Map<string, HTMLImageElement>();
        this.sounds = new Map<string, HTMLAudioElement>();
    }

    clearAssets() {
        this.textures.clear();
        this.sounds.clear();
    }

    addTexture(assetId: string, filePath: string) {
        const texture = new Image();
        texture.src = filePath;
        this.textures.set(assetId, texture);

        console.log('Texture added to the AssetStore with id ' + assetId);
    }

    getTexture(assetId: string) {
        const texture = this.textures.get(assetId);

        if (!texture) {
            throw new Error('Could not find texture with asset id: ' + assetId);
        }

        return texture;
    }

    addSound(assetId: string, filePath: string) {
        const sound = new Audio();
        sound.src = filePath;
        this.sounds.set(assetId, sound);

        console.log('Sound added to the AssetStore with id ' + assetId);
    }

    getSound(assetId: string) {
        const sound = this.sounds.get(assetId);

        if (!sound) {
            throw new Error('Could not find sound with asset id: ' + assetId);
        }

        return sound;
    }
}
