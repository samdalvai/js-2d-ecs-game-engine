import Component from '../ecs/Component';
import { Vector } from '../types';

export default class PlayerFollowComponent extends Component {
    detectionRadius: number;
    minFollowDistance: number;
    offset: Vector;

    constructor(detectionRadius = 0, minFollowDistance = 0, offset = { x: 0, y: 0 }) {
        super();
        this.detectionRadius = detectionRadius;
        this.minFollowDistance = minFollowDistance;
        this.offset = offset;
    }
}
