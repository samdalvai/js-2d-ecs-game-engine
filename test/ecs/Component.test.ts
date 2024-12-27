import { expect } from '@jest/globals';

import Component, { IComponent } from '../../src/ecs/Component';

describe('Testing Component related functions', () => {
    beforeEach(() => {
        IComponent.resetIds();
    });

    test('The first component created should have id 0', () => {
        class MyComponent extends Component { }

        expect(MyComponent.getId()).toBe(0);
        expect(MyComponent.getId()).toBe(0);
    });

    test('The second component created should have id 1', () => {
        class MyComponent1 extends Component { }
        class MyComponent2 extends Component { }

        expect(MyComponent1.getId()).toBe(0);
        expect(MyComponent2.getId()).toBe(1);
        expect(MyComponent1.getId()).toBe(0);
        expect(MyComponent2.getId()).toBe(1);
    });
});
