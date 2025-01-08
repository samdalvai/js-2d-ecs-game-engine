import Component from '../ecs/Component';
import { Vec2 } from '../types/types';

export default class TransformComponent extends Component {
    position: Vec2;
    scale: Vec2;
    // Rotation is expressed in degrees
    rotation: number;

    constructor(position: Vec2 = { x: 0, y: 0 }, scale: Vec2 = { x: 1, y: 1 }, rotation: number = 0.0) {
        super();
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }
}
