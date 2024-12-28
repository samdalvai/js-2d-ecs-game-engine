import { expect } from '@jest/globals';

import Component, { IComponent } from '../src/ecs/Component';
import Entity from '../src/ecs/Entity';
import Registry from '../src/ecs/Registry';

describe('Testing Registry related functions', () => {
    beforeEach(() => {
        IComponent.resetIds();
    });

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

    test('Should set entity component signature at bit 0 for one entity and one component', () => {
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

        expect(registry.entityComponentSignatures[0].test(0)).toBe(true);
    });

    test('Should set entity component signature at bit 0 and 1 for one entity and multiple components', () => {
        const registry = new Registry();
        const entity = registry.createEntity();

        class MyComponent1 extends Component {}
        class MyComponent2 extends Component {}

        entity.addComponent(MyComponent1);
        entity.addComponent(MyComponent2);

        console.log(registry.entityComponentSignatures);

        expect(registry.entityComponentSignatures[0].test(0)).toBe(true);
        expect(registry.entityComponentSignatures[0].test(1)).toBe(true);
    });

    test('Should set entity component signature at bit 0 for more entities and one component', () => {
        const registry = new Registry();
        const entity1 = registry.createEntity();
        const entity2 = registry.createEntity();
        const entity3 = registry.createEntity();

        class MyComponent extends Component {}

        entity1.addComponent(MyComponent);
        entity2.addComponent(MyComponent);
        entity3.addComponent(MyComponent);

        expect(registry.entityComponentSignatures[0].test(0)).toBe(true);
        expect(registry.entityComponentSignatures[1].test(0)).toBe(true);
        expect(registry.entityComponentSignatures[2].test(0)).toBe(true);
    });
});
