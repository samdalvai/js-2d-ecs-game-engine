import { expect } from '@jest/globals';

import PlayerFollowComponent from '../../src/components/PlayerFollowComponent';
import RigidBodyComponent from '../../src/components/RigidBodyComponent';
import SpriteComponent from '../../src/components/SpriteComponent';
import TransformComponent from '../../src/components/TransformComponent';
import Registry from '../../src/ecs/Registry';
import PlayerFollowSystem from '../../src/systems/PlayerFollowSystem';

describe('Testing Player follow system related functions', () => {
    test('Entity should move right if player is in the top right corner', () => {
        const registry = new Registry();

        const entity = registry.createEntity();
        entity.addComponent(TransformComponent, { x: 500, y: 500 }, { x: 1, y: 1 }, 0);
        entity.addComponent(RigidBodyComponent, { x: 0, y: 0 });
        entity.addComponent(PlayerFollowComponent, 400, 100, 50, { x: 16, y: 16 });

        const player = registry.createEntity();
        player.addComponent(SpriteComponent, 'test', 32, 32);
        player.addComponent(TransformComponent, { x: 600, y: 400 }, { x: 1, y: 1 }, 0);
        player.tag('player');

        registry.addSystem(PlayerFollowSystem);

        registry.update();

        registry.getSystem(PlayerFollowSystem)?.update(registry);

        const rigidBody = entity.getComponent(RigidBodyComponent);

        expect(rigidBody?.velocity.x).toBe(50);
    });

    test('Entity should move right if player is in the bottom right corner', () => {
        const registry = new Registry();

        const entity = registry.createEntity();
        entity.addComponent(TransformComponent, { x: 500, y: 500 }, { x: 1, y: 1 }, 0);
        entity.addComponent(RigidBodyComponent, { x: 0, y: 0 });
        entity.addComponent(PlayerFollowComponent, 400, 100, 50, { x: 16, y: 16 });

        const player = registry.createEntity();
        player.addComponent(SpriteComponent, 'test', 32, 32);
        player.addComponent(TransformComponent, { x: 600, y: 600 }, { x: 1, y: 1 }, 0);
        player.tag('player');

        registry.addSystem(PlayerFollowSystem);

        registry.update();

        registry.getSystem(PlayerFollowSystem)?.update(registry);

        const rigidBody = entity.getComponent(RigidBodyComponent);

        expect(rigidBody?.velocity.x).toBe(50);
    });

    test('Entity should move left if player is in the top left corner', () => {
        const registry = new Registry();

        const entity = registry.createEntity();
        entity.addComponent(TransformComponent, { x: 500, y: 500 }, { x: 1, y: 1 }, 0);
        entity.addComponent(RigidBodyComponent, { x: 0, y: 0 });
        entity.addComponent(PlayerFollowComponent, 400, 100, 50, { x: 16, y: 16 });

        const player = registry.createEntity();
        player.addComponent(SpriteComponent, 'test', 32, 32);
        player.addComponent(TransformComponent, { x: 400, y: 400 }, { x: 1, y: 1 }, 0);
        player.tag('player');

        registry.addSystem(PlayerFollowSystem);

        registry.update();

        registry.getSystem(PlayerFollowSystem)?.update(registry);

        const rigidBody = entity.getComponent(RigidBodyComponent);

        expect(rigidBody?.velocity.x).toBe(-50);
    });

    test('Entity should move left if player is in the bottom left corner', () => {
        const registry = new Registry();

        const entity = registry.createEntity();
        entity.addComponent(TransformComponent, { x: 500, y: 500 }, { x: 1, y: 1 }, 0);
        entity.addComponent(RigidBodyComponent, { x: 0, y: 0 });
        entity.addComponent(PlayerFollowComponent, 400, 100, 50, { x: 16, y: 16 });

        const player = registry.createEntity();
        player.addComponent(SpriteComponent, 'test', 32, 32);
        player.addComponent(TransformComponent, { x: 400, y: 600 }, { x: 1, y: 1 }, 0);
        player.tag('player');

        registry.addSystem(PlayerFollowSystem);

        registry.update();

        registry.getSystem(PlayerFollowSystem)?.update(registry);

        const rigidBody = entity.getComponent(RigidBodyComponent);

        expect(rigidBody?.velocity.x).toBe(-50);
    });
});
