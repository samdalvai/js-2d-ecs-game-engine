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
        const current = this.entityIdToIndex.get(entityId);

        if (current !== undefined) {
            this.data[current] = component;
        } else {
            const index = this.size;
            this.entityIdToIndex.set(entityId, index);
            this.indexToEntityId.set(index, entityId);
            this.data[index] = component;
            this.size++;
        }
    }
}
