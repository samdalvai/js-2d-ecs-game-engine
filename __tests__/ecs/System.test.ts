import { expect } from '@jest/globals';

import System, { ISystem } from '../../src/ecs/System';

describe('Testing System related functions', () => {
    beforeEach(() => {
        ISystem.resetIds();
    });

    test('The first System created should have id 0', () => {
        class MySystem extends System { }

        expect(MySystem.getId()).toBe(0);
        expect(MySystem.getId()).toBe(0);
    });

    test('The second System created should have id 1', () => {
        class MySystem1 extends System { }
        class MySystem2 extends System { }

        expect(MySystem1.getId()).toBe(0);
        expect(MySystem2.getId()).toBe(1);
    });
});
