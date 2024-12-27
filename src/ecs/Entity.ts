import Registry from './Registry';

export default class Entity {
    private id: number;
    registry: Registry | undefined;

    constructor(id: number) {
        this.id = id;
    }

    getId = () => {
        return this.id;
    };
}
