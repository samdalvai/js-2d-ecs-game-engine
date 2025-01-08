import { expect } from '@jest/globals';

import KeyboardControlComponent from '../../src/components/KeyboardControlComponent';
import RigidBodyComponent from '../../src/components/RigidBodyComponent';
import KeyboardControlSystem, { MovementDirection } from '../../src/systems/KeyboardControlSystem';

describe('Testing KeyboardControl system related functions', () => {
    test('Entity rigid body should accellerate up based on accelleration value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 20);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.UP);

        expect(rigidBody.velocity).toEqual({ x: 0, y: -20 });
    });

    test('Entity rigid body should accellerate right based on accelleration value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 20);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.RIGHT);

        expect(rigidBody.velocity).toEqual({ x: 20, y: 0 });
    });

    test('Entity rigid body should accellerate left based on accelleration value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 20);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.DOWN);

        expect(rigidBody.velocity).toEqual({ x: 0, y: 20 });
    });

    test('Entity rigid body should accellerate left based on accelleration value', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 20);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.LEFT);

        expect(rigidBody.velocity).toEqual({ x: -20, y: 0 });
    });

    test('Entity rigid body should not accellerate up beyond the max up velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: -75 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 50);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.UP);
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.UP);

        expect(rigidBody.velocity).toEqual({ x: 0, y: -100 });
    });

    test('Entity rigid body should not accellerate right beyond the max right velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: 75, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 50);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.RIGHT);
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.RIGHT);

        expect(rigidBody.velocity).toEqual({ x: 100, y: 0 });
    });

    test('Entity rigid body should not accellerate down beyond the max down velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: 0, y: 75 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 50);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.DOWN);
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.DOWN);

        expect(rigidBody.velocity).toEqual({ x: 0, y: 100 });
    });

    test('Entity rigid body should not accellerate up beyond the max up velocity', () => {
        const rigidBody = new RigidBodyComponent({ x: -75, y: 0 });
        const keyboardControl = new KeyboardControlComponent(-100, 100, 100, -100, 50);

        const keyboardControlSystem = new KeyboardControlSystem();
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.LEFT);
        keyboardControlSystem.accellerateEntity(rigidBody, keyboardControl, MovementDirection.LEFT);

        expect(rigidBody.velocity).toEqual({ x: -100, y: 0 });
    });
});
