import Component from '../ecs/Component';

export default class PlayerDetectionComponent extends Component {
    detectionRadius: number;

    constructor(detectionRadius = 0) {
        super();
        this.detectionRadius = detectionRadius;
    }
}
