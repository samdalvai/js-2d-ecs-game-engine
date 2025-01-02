export default class AssetStore {
    private textures: Map<string, HTMLImageElement>;

    constructor() {
        this.textures = new Map<string, HTMLImageElement>();
    }

    clearAssets() {
        this.textures.clear();
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
}
