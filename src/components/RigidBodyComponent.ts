import Component from '../ecs/Component.js';
import { Vec2 } from '../types/types.js';

export default class RigidBodyComponent extends Component {
    velocity: Vec2;
    direction: Vec2;

    constructor(velocity = { x: 0, y: 0 }, direction = { x: 0, y: 0 }) {
        super();
        this.velocity = velocity;
        this.direction = direction;
    }
}
