import { expect } from '@jest/globals';

import KeyboardControlComponent from '../../src/components/KeyboardControlComponent';
import RigidBodyComponent from '../../src/components/RigidBodyComponent';
import SpriteComponent from '../../src/components/SpriteComponent';
import KeyboardControlSystem from '../../src/systems/KeyboardControlSystem';
import { Direction } from '../../src/types';

describe('Testing KeyboardControl system related functions', () => {
    test('Entity rigid body should move up based on corresponging velocity value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.UP);

        expect(rigidBody.velocity).toEqual({ x: 0, y: -100 });
        expect(rigidBody.direction).toEqual({ x: 0, y: -1 });
    });

    test('Entity rigid body should move right based on corresponging velocity value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.RIGHT);

        expect(rigidBody.velocity).toEqual({ x: 100, y: 0 });
        expect(rigidBody.direction).toEqual({ x: 1, y: 0 });
    });

    test('Entity rigid body should move left based on corresponging velocity value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.DOWN);

        expect(rigidBody.velocity).toEqual({ x: 0, y: 100 });
        expect(rigidBody.direction).toEqual({ x: 0, y: 1 });
    });

    test('Entity rigid body should move left based on corresponging velocity value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.LEFT);

        expect(rigidBody.velocity).toEqual({ x: -100, y: 0 });
        expect(rigidBody.direction).toEqual({ x: -1, y: 0 });
    });

    test('Entity rigid body should not move up beyond the max up velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: -75 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.UP);
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.UP);

        expect(rigidBody.velocity).toEqual({ x: 0, y: -100 });
        expect(rigidBody.direction).toEqual({ x: 0, y: -1 });
    });

    test('Entity rigid body should not move right beyond the max right velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: 75, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.RIGHT);
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.RIGHT);

        expect(rigidBody.velocity).toEqual({ x: 100, y: 0 });
        expect(rigidBody.direction).toEqual({ x: 1, y: 0 });
    });

    test('Entity rigid body should not move down beyond the max down velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 75 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.DOWN);
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.DOWN);

        expect(rigidBody.velocity).toEqual({ x: 0, y: 100 });
        expect(rigidBody.direction).toEqual({ x: 0, y: 1 });
    });

    test('Entity rigid body should not move up beyond the max up velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: -75, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100);
        const sprite = new SpriteComponent('test-asset', 32, 32, 1, 0, 0);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.LEFT);
        keyboardControlSystem.updateEntityMovement(rigidBody, keyboardControl, sprite, Direction.LEFT);

        expect(rigidBody.velocity).toEqual({ x: -100, y: 0 });
        expect(rigidBody.direction).toEqual({ x: -1, y: 0 });
    });
});
