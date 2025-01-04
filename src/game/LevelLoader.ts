import bulletSprite from '../../assets/images/bullet.png';
import chopperSpriteSheet from '../../assets/images/chopper-green-spritesheet.png';
import tankSpriteSheet from '../../assets/images/tank-panther-spritesheet.png';
import treeSprite from '../../assets/images/tree.png';
import desertSpriteSheet from '../../assets/tilemaps/desert.png';
import tileMapJson from '../../assets/tilemaps/tilemap.json';
import AssetStore from '../asset-store/AssetStore';
import AnimationComponent from '../components/AnimationComponent';
import BoxColliderComponent from '../components/BoxColliderComponent';
import CameraFollowComponent from '../components/CameraFollowComponent';
import HealthComponent from '../components/HealthComponent';
import KeyboardControlComponent from '../components/KeyboardControlComponent';
import ProjectileEmitterComponent from '../components/ProjectileEmitterComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import { Flip, TileMap } from '../types';
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
        assetStore.addTexture('tree-texture', treeSprite);
        assetStore.addTexture('bullet-texture', bulletSprite);
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
        player.addComponent(TransformComponent, { x: 300, y: 300 }, { x: 1, y: 1 }, 0);
        player.addComponent(SpriteComponent, 'chopper-texture', 32, 32, 1, 0, 0);
        player.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: 0, y: -1 });
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
        player.addComponent(HealthComponent, 100);
        player.addComponent(ProjectileEmitterComponent, { x: 200, y: 200 }, 0, 3000, 10, true);
        player.tag('player');

        const enemy1 = registry.createEntity();
        enemy1.addComponent(TransformComponent, { x: 500, y: 500 }, { x: 1, y: 1 }, 0);
        enemy1.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 32, Flip.HORIZONTAL);
        enemy1.addComponent(RigidBodyComponent, { x: -50, y: 0 });
        enemy1.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        enemy1.addComponent(HealthComponent, 100);
        enemy1.group('enemies');

        const enemy2 = registry.createEntity();
        enemy2.addComponent(TransformComponent, { x: 650, y: 600 }, { x: 1, y: 1 }, 0);
        enemy2.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 0);
        enemy2.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: 0, y: -1 });
        enemy2.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        enemy2.addComponent(HealthComponent, 50);
        enemy2.addComponent(ProjectileEmitterComponent, { x: 0, y: -100 }, 1000, 3000, 20, false);
        enemy2.group('enemies');

        const enemy3 = registry.createEntity();
        enemy3.addComponent(TransformComponent, { x: 250, y: 500 }, { x: 1, y: 1 }, 0);
        enemy3.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 0);
        enemy3.addComponent(RigidBodyComponent, { x: 0, y: -50 });
        enemy3.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        enemy3.addComponent(HealthComponent, 50);
        enemy3.addComponent(ProjectileEmitterComponent, { x: 0, y: -100 }, 1000, 1000, 20, false);
        enemy3.group('enemies');

        const tree1 = registry.createEntity();
        tree1.addComponent(TransformComponent, { x: 400, y: 500 }, { x: 1, y: 1 }, 0);
        tree1.addComponent(SpriteComponent, 'tree-texture', 32, 32, 1, 0);
        tree1.addComponent(BoxColliderComponent, 15, 30, { x: 0, y: 0 });
        tree1.group('obstacles');

        const tree2 = registry.createEntity();
        tree2.addComponent(TransformComponent, { x: 600, y: 500 }, { x: 1, y: 1 }, 0);
        tree2.addComponent(SpriteComponent, 'tree-texture', 32, 32, 1, 0);
        tree2.addComponent(BoxColliderComponent, 15, 30, { x: 0, y: 0 });
        tree2.group('obstacles');
    }
}
