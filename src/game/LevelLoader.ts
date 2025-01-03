import chopperSpriteSheet from '../../assets/images/chopper-green-spritesheet.png';
import tankSpriteSheet from '../../assets/images/tank-panther-spritesheet.png';
import desertSpriteSheet from '../../assets/tilemaps/desert.png';
import tileMapJson from '../../assets/tilemaps/tilemap.json';
import AssetStore from '../asset-store/AssetStore';
import AnimationComponent from '../components/AnimationComponent';
import BoxColliderComponent from '../components/BoxColliderComponent';
import CameraFollowComponent from '../components/CameraFollowComponent';
import KeyboardControlComponent from '../components/KeyboardControlComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import { TileMap } from '../types';
import Game from './Game';

export default class LevelLoader {
    public loadLevel(registry: Registry, assetStore: AssetStore) {
        this.loadAssets(assetStore);
        this.loadTileMap(registry);
        this.loadEntities(registry);
    }

    private loadAssets(assetStore: AssetStore) {
        assetStore.addTexture('chopper-texture', chopperSpriteSheet);
        assetStore.addTexture('tank-texture', tankSpriteSheet);
        assetStore.addTexture('desert-texture', desertSpriteSheet);
    }

    private loadTileMap(registry: Registry) {
        const tileMap: TileMap = tileMapJson;

        const tileSize = 32;
        const mapScale = 2;

        let rowNumber = 0;
        let columnNumber = 0;

        for (let i = 0; i < tileMap.tiles.length; i++) {
            columnNumber = 0;
            for (let j = 0; j < tileMap.tiles[i].length; j++) {
                const tileNumber = tileMap.tiles[i][j];
                const srcRectX = (tileNumber % 10) * tileSize;
                const srcRectY = Math.floor(tileNumber / 10) * tileSize;

                const tile = registry.createEntity();
                tile.addComponent(
                    TransformComponent,
                    {
                        x: columnNumber * (mapScale * tileSize),
                        y: rowNumber * (mapScale * tileSize),
                    },
                    { x: mapScale, y: mapScale },
                    0,
                );
                tile.addComponent(SpriteComponent, 'desert-texture', tileSize, tileSize, 0, srcRectX, srcRectY);

                columnNumber++;
            }

            rowNumber++;
        }

        Game.mapWidth = columnNumber * tileSize * mapScale;
        Game.mapHeight = rowNumber * tileSize * mapScale;
    }

    private loadEntities(registry: Registry) {
        const player = registry.createEntity();
        player.addComponent(TransformComponent, { x: 100, y: 100 }, { x: 1, y: 1 }, 0);
        player.addComponent(SpriteComponent, 'chopper-texture', 32, 32, 1, 0, 0);
        player.addComponent(RigidBodyComponent, { x: 0, y: 0 });
        player.addComponent(CameraFollowComponent);
        player.addComponent(
            KeyboardControlComponent,
            { x: 0, y: -300 },
            { x: 300, y: 0 },
            { x: 0, y: 300 },
            { x: -300, y: 0 },
        );
        player.addComponent(AnimationComponent, 2, 10);
        player.addComponent(BoxColliderComponent, 32, 25, { x: 0, y: 5 });

        const enemy = registry.createEntity();
        enemy.addComponent(TransformComponent, { x: 200, y: 200 }, { x: 1, y: 1 }, 0);
        enemy.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 32);
        enemy.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
    }
}
