import { expect } from '@jest/globals';

import Component, { IComponent } from '../src/ecs/Component';
import Pool from '../src/ecs/Pool';

describe('Testing Pool related functions', () => {
    beforeEach(() => {
        IComponent.resetIds();
    });

    test('An empty pool should have size 0', () => {
        const pool = new Pool();

        expect(pool.isEmpty()).toBe(true);
        expect(pool.getSize()).toBe(0);
    });

    test('Should correctly set component pool for one entity and one component', () => {
        class MyComponent extends Component {}
        const pool = new Pool<MyComponent>();

        const component = new MyComponent();

        pool.set(0, component);

        expect(pool.data[0]).toEqual(component);
        expect(pool.entityIdToIndex.get(0)).toBe(0);
        expect(pool.indexToEntityId.get(0)).toBe(0);
    });

    test('Should correctly set component pool for two entities and two components', () => {
        class MyComponent extends Component {}
        const pool = new Pool<MyComponent>();

        const component1 = new MyComponent();
        const component2 = new MyComponent();

        pool.set(0, component1);
        pool.set(1, component2);

        expect(pool.data[0]).toEqual(component1);
        expect(pool.entityIdToIndex.get(0)).toBe(0);
        expect(pool.indexToEntityId.get(0)).toBe(0);
        expect(pool.entityIdToIndex.get(1)).toBe(1);
        expect(pool.indexToEntityId.get(1)).toBe(1);
    });
});
