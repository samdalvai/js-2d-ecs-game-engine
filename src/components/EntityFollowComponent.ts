import Component from '../ecs/Component';
import { Vector } from '../types';

export default class EntityFollowComponent extends Component {
    detectionRadius: number;
    minFollowDistance: number;
    followVelocity: number;
    offset: Vector;

    constructor(detectionRadius = 0, minFollowDistance = 0, followVelocity = 0, offset = { x: 0, y: 0 }) {
        super();
        this.detectionRadius = detectionRadius;
        this.minFollowDistance = minFollowDistance;
        this.followVelocity = followVelocity;
        this.offset = offset;
    }
}
