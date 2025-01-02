import Component from '../ecs/Component';
import { Vec2 } from '../types';

export default class KeyboardControlComponent extends Component {
    upVelocity: Vec2;
    rightVelocity: Vec2;
    downVelocity: Vec2;
    leftVelocity: Vec2;

    constructor(
        upVelocity = { x: 0, y: 0 },
        rightVelocity = { x: 0, y: 0 },
        downVelocity = { x: 0, y: 0 },
        leftVelocity = { x: 0, y: 0 },
    ) {
        super();
        this.upVelocity = upVelocity;
        this.rightVelocity = rightVelocity;
        this.downVelocity = downVelocity;
        this.leftVelocity = leftVelocity;
    }
}
