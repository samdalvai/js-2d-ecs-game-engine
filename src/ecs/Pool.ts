import Component from './Component';

export class IPool {}

export default class Pool<T extends Component> extends IPool {
    data: T[];
    size: number;
    entityIdToIndex: Map<number, number>;
    indexToEntityId: Map<number, number>;

    constructor() {
        super();
        this.data = [];
        this.size = 0;
        this.entityIdToIndex = new Map<number, number>();
        this.indexToEntityId = new Map<number, number>();
    }

    isEmpty() {
        return this.size == 0;
    }

    getSize() {
        return this.size;
    }

    clear() {
        this.data = [];
        this.entityIdToIndex.clear();
        this.indexToEntityId.clear();
        this.size = 0;
    }

    set(entityId: number, component: T) {
        const index = this.entityIdToIndex.get(entityId);

        if (index !== undefined) {
            // If the element already exists, simply replace the component object
            this.data[index] = component;
        } else {
            const index = this.size;
            this.entityIdToIndex.set(entityId, index);
            this.indexToEntityId.set(index, entityId);
            this.data[index] = component;
            this.size++;
        }
    }

    remove(entityId: number) {
        // Copy the last element to the deleted position to keep the array packed
        const indexOfRemoved = this.entityIdToIndex.get(entityId);

        if (indexOfRemoved === undefined) {
            console.error('Could not find entity with id ' + entityId + ' in component pool');
            return;
        }

        const indexOfLast = this.size - 1;
        this.data[indexOfRemoved] = this.data[indexOfLast];
        this.data.splice(indexOfLast, 1);

        // Update the index-entity maps to point to the correct elements
        const entityIdOfLastElement = this.indexToEntityId.get(indexOfLast);

        if (entityIdOfLastElement === undefined) {
            console.error('Could not find last index of entity in component pool');
            return;
        }

        this.entityIdToIndex.set(entityIdOfLastElement, indexOfRemoved);
        this.indexToEntityId.set(indexOfRemoved, entityIdOfLastElement);

        this.entityIdToIndex.delete(entityId);
        this.indexToEntityId.delete(indexOfLast);

        this.size--;
    }
}
