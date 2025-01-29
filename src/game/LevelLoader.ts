import AssetStore from '../asset-store/AssetStore';
import AnimationComponent from '../components/AnimationComponent';
import BoxColliderComponent from '../components/BoxColliderComponent';
import CameraFollowComponent from '../components/CameraFollowComponent';
import CameraShakeComponent from '../components/CameraShakeComponent';
import EntityFollowComponent from '../components/EntityFollowComponent';
import ExplosionOnDeathComponent from '../components/ExplosionOnDeathComponent';
import ExplosionOnHitComponent from '../components/ExplosionOnHitComponent';
import HealthComponent from '../components/HealthComponent';
import KeyboardControlComponent from '../components/KeyboardControlComponent';
import ProjectileEmitterComponent from '../components/ProjectileEmitterComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import ScriptComponent from '../components/ScriptComponent';
import ShadowComponent from '../components/ShadowComponent';
import SoundComponent from '../components/SoundComponent';
import SpriteComponent from '../components/SpriteComponent';
import SpriteDirectionComponent from '../components/SpriteDirectionComponent';
import TextLabelComponent from '../components/TextLabelComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import { Flip, TileMap } from '../types';
import Game from './Game';

export default class LevelLoader {
    public static async loadLevel(registry: Registry, assetStore: AssetStore) {
        await this.loadAssets(assetStore);
        this.loadTileMap(registry, assetStore);
        this.loadEntities(registry);
    }

    private static async loadAssets(assetStore: AssetStore) {
        console.log('Loading assets');
        await assetStore.addTexture('desert-texture', './assets/tilemaps/desert.png');
        await assetStore.addTexture('chopper-green-texture', './assets/images/chopper-green-spritesheet.png');
        await assetStore.addTexture('chopper-white-texture', './assets/images/chopper-white-spritesheet.png');
        await assetStore.addTexture('tank-texture', './assets/images/tank-panther-spritesheet.png');
        await assetStore.addTexture('f22-texture', './assets/images/f22-spritesheet.png');
        await assetStore.addTexture('truck-texture', './assets/images/truck-ford-spritesheet.png');
        await assetStore.addTexture('cannon-texture', './assets/images/cannon-spritesheet.png');
        await assetStore.addTexture('radar-texture', './assets/images/radar-spritesheet.png');

        await assetStore.addTexture('tree-texture', './assets/images/tree.png');
        await assetStore.addTexture('bullet-texture', './assets/images/bullet.png');
        await assetStore.addTexture('explosion-texture', './assets/images/explosion.png');
        await assetStore.addTexture('explosion-small-texture', './assets/images/explosion-small.png');

        await assetStore.addSound('helicopter', './assets/sounds/helicopter-long.wav');
        await assetStore.addSound('explosion-big', './assets/sounds/explosion-big.wav');
        await assetStore.addSound('explosion-small', './assets/sounds/explosion-small.wav');

        await assetStore.addJson('tile-map', '/assets/tilemaps/tilemap.json');
    }

    private static loadTileMap(registry: Registry, assetStore: AssetStore) {
        console.log('Loading tilemap');
        const tileMap = assetStore.getJson('tile-map') as TileMap;

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

    private static loadEntities(registry: Registry) {
        console.log('Loading entities');
        const player = registry.createEntity();
        player.addComponent(TransformComponent, { x: 240, y: 100 }, { x: 1, y: 1 }, 0);
        player.addComponent(SpriteComponent, 'chopper-green-texture', 32, 32, 1, 0, 0);
        player.addComponent(ShadowComponent, 32, 16, -1, 0);
        player.addComponent(AnimationComponent, 2, 10);
        player.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: 1, y: 0 });
        player.addComponent(CameraFollowComponent);
        player.addComponent(KeyboardControlComponent, -300, 300, 300, -300);
        player.addComponent(BoxColliderComponent, 32, 25, { x: 0, y: 5 });
        player.addComponent(HealthComponent, 100);
        player.addComponent(ProjectileEmitterComponent, { x: 200, y: 200 }, 50, 3000, 10, true);
        player.addComponent(ExplosionOnDeathComponent);
        player.addComponent(ExplosionOnHitComponent);
        player.addComponent(CameraShakeComponent, 100);
        player.addComponent(SpriteDirectionComponent);
        //player.addComponent(SoundComponent, 'helicopter', 1, 0.5);
        player.tag('player');

        const radar = registry.createEntity();
        radar.addComponent(
            TransformComponent,
            { x: Game.windowWidth - 100, y: Game.windowHeight - 100 },
            { x: 1, y: 1 },
        );
        radar.addComponent(SpriteComponent, 'radar-texture', 64, 64, 4, 0, 0, Flip.NONE, true);
        radar.addComponent(AnimationComponent, 8, 7.5);

        const enemy1 = registry.createEntity();
        enemy1.addComponent(TransformComponent, { x: 500, y: 500 }, { x: 1, y: 1 }, 0);
        enemy1.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 32);
        enemy1.addComponent(RigidBodyComponent, { x: -50, y: 0 }, { x: -1, y: 0 });
        enemy1.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        enemy1.addComponent(HealthComponent, 100);
        enemy1.addComponent(ExplosionOnDeathComponent);
        enemy1.addComponent(ExplosionOnHitComponent);
        enemy1.addComponent(SpriteDirectionComponent);
        enemy1.group('enemies');

        // for (let i = 0; i < 5; i++) {
        //     const enemy = registry.createEntity();
        //     enemy.addComponent(
        //         TransformComponent,
        //         { x: Math.random() * (Game.mapWidth - 100) + 100, y: Math.random() * (Game.mapHeight - 100) + 100 },
        //         { x: 1, y: 1 },
        //         0,
        //     );

        //     if (i % 2 === 0) {
        //         enemy.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 0);
        //     } else {
        //         enemy.addComponent(SpriteComponent, 'truck-texture', 32, 32, 1, 0, 0);
        //     }
        //     enemy.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: 0, y: -1 });
        //     enemy.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        //     enemy.addComponent(HealthComponent, 100);
        //     enemy.addComponent(ProjectileEmitterComponent, { x: 100, y: 100 }, 1000, 3000, 2, false);
        //     enemy.addComponent(ExplosionOnDeathComponent);
        //     enemy.addComponent(ExplosionOnHitComponent);
        //     enemy.addComponent(PlayerFollowComponent, 250, 50, 50, { x: 16, y: 16 });
        //     enemy.addComponent(SpriteDirectionComponent);
        //     enemy.group('enemies');
        // }

        // for (let i = 0; i < 4; i++) {
        //     const enemy = registry.createEntity();
        //     enemy.addComponent(
        //         TransformComponent,
        //         { x: Math.random() * (Game.mapWidth - 100) + 100, y: Math.random() * (Game.mapHeight - 100) + 100 },
        //         { x: 1, y: 1 },
        //         0,
        //     );

        //     if (i % 2 === 0) {
        //         enemy.addComponent(SpriteComponent, 'chopper-white-texture', 32, 32, 1, 0, 0);
        //     } else {
        //         enemy.addComponent(SpriteComponent, 'f22-texture', 32, 32, 1, 0, 0);
        //     }
        //     enemy.addComponent(ShadowComponent, 32, 16, -1, 0);
        //     enemy.addComponent(AnimationComponent, 2, 10);
        //     enemy.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: 0, y: -1 });
        //     enemy.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        //     enemy.addComponent(HealthComponent, 100);
        //     enemy.addComponent(ProjectileEmitterComponent, { x: 100, y: 100 }, 1000, 3000, 2, false);
        //     enemy.addComponent(ExplosionOnDeathComponent);
        //     enemy.addComponent(ExplosionOnHitComponent);
        //     enemy.addComponent(PlayerFollowComponent, 350, 150, 150, { x: 16, y: 16 });
        //     enemy.addComponent(SpriteDirectionComponent);
        //     enemy.group('enemies');
        // }

        const enemy3 = registry.createEntity();
        enemy3.addComponent(TransformComponent, { x: 300, y: 600 }, { x: 1, y: 1 }, 0);
        enemy3.addComponent(SpriteComponent, 'tank-texture', 32, 32, 1, 0, 0);
        enemy3.addComponent(RigidBodyComponent, { x: 50, y: 0 }, { x: 1, y: 0 });
        enemy3.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        enemy3.addComponent(HealthComponent, 50);
        enemy3.addComponent(ProjectileEmitterComponent, { x: 100, y: 100 }, 1000, 2000, 5, false);
        enemy3.addComponent(ExplosionOnDeathComponent);
        enemy3.addComponent(ExplosionOnHitComponent);
        enemy3.addComponent(SpriteDirectionComponent);
        enemy3.addComponent(EntityFollowComponent, 250, 100, 50, { x: 16, y: 16 }, 5000);
        enemy3.addComponent(ScriptComponent, [
            { movement: { x: 50, y: 0 }, duration: 2000 },
            { movement: { x: 0, y: 50 }, duration: 2000 },
            { movement: { x: -50, y: 0 }, duration: 2000 },
            { movement: { x: 0, y: -50 }, duration: 2000 },
        ]);
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

        // const cannon = registry.createEntity();
        // cannon.addComponent(TransformComponent, { x: 800, y: 700 }, { x: 1, y: 1 }, 0);
        // cannon.addComponent(SpriteComponent, 'cannon-texture', 32, 32, 1, 0, 0);
        // cannon.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: -1, y: 0 });
        // cannon.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        // cannon.addComponent(HealthComponent, 100);
        // cannon.addComponent(ProjectileEmitterComponent, { x: 100, y: 100 }, 1000, 2000, 10, false);
        // cannon.addComponent(ExplosionOnDeathComponent);
        // cannon.addComponent(ExplosionOnHitComponent);
        // cannon.addComponent(SpriteDirectionComponent);
        // cannon.addComponent(EntityFollowComponent, 250, 100, 0, { x: 16, y: 16 }, 2000);
        // cannon.group('enemies');

        // const enemy = registry.createEntity();
        // enemy.addComponent(TransformComponent, { x: 1000, y: 300 }, { x: 1.5, y: 1.5 }, 0);
        // enemy.addComponent(SpriteComponent, 'chopper-white-texture', 32, 32, 1, 0, 0);
        // enemy.addComponent(ShadowComponent, 40, 20, -1, 0);
        // enemy.addComponent(AnimationComponent, 2, 10);
        // enemy.addComponent(RigidBodyComponent, { x: 0, y: 0 }, { x: 0, y: 1 });
        // enemy.addComponent(BoxColliderComponent, 25, 20, { x: 4, y: 7 });
        // enemy.addComponent(HealthComponent, 100);
        // enemy.addComponent(ProjectileEmitterComponent, { x: 200, y: 200 }, 1000, 5000, 20, false);
        // enemy.addComponent(ExplosionOnDeathComponent);
        // enemy.addComponent(ExplosionOnHitComponent);
        // enemy.addComponent(EntityFollowComponent, 200, 100, 150, { x: 16, y: 16 }, 5000);
        // enemy.addComponent(SpriteDirectionComponent);
        // enemy.addComponent(ScriptComponent, [
        //     { movement: { x: 0, y: 50 }, duration: 4000 },
        //     { movement: { x: -50, y: 0 }, duration: 4000 },
        //     { movement: { x: 0, y: -50 }, duration: 4000 },
        //     { movement: { x: 50, y: 0 }, duration: 4000 },
        // ]);
        // enemy.group('enemies');

        const label = registry.createEntity();
        const color = { r: 255, g: 255, b: 255 };
        label.addComponent(TextLabelComponent, { x: 50, y: 50 }, 'Chopper 1.0', color, true, '24px Arial');
    }
}
