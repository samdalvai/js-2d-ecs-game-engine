import { expect } from '@jest/globals';

import Component from '../src/ecs/Component';
import Entity from '../src/ecs/Entity';
import Registry from '../src/ecs/Registry';

describe('Testing Registry related functions', () => {
    test('Should add entity to registry entities to be added', () => {
        const registry = new Registry();
        const entity = registry.createEntity();

        expect(entity.getId()).toBe(0);
        expect(entity.registry).toEqual(registry);
        expect(registry.entitiesToBeAdded.size).toBe(1);
    });

    test('Should add entity to registry entities to be killed', () => {
        const registry = new Registry();
        const entity = new Entity(1);
        registry.killEntity(entity);

        expect(registry.entitiesToBeKilled.size).toBe(1);
    });

    test('Should create entity with id from the free ids', () => {
        const registry = new Registry();
        registry.freeIds = [999];

        const entity = registry.createEntity();

        expect(entity.getId()).toBe(999);
        expect(entity.registry).toEqual(registry);
        expect(registry.entitiesToBeAdded.size).toBe(1);
        expect(registry.freeIds.length).toBe(0);
    });

    test('Should add new component to entity', () => {
        const registry = new Registry();
        const entity = registry.createEntity();

        class MyComponent extends Component {
            param: number;

            constructor(param: number) {
                super();
                this.param = param;
            }
        }

        entity.addComponent(MyComponent, 1);
        entity.addComponent(MyComponent, 2);
    });
});
