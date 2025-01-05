import Component from '../ecs/Component';

export default class DurationComponent extends Component {
    duration: number;
    startTime: number;

    constructor(duration = 0) {
        super();
        this.duration = duration;
        this.startTime = performance.now();
    }
}
