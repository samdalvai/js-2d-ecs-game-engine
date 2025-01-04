import Component from '../ecs/Component';

export default class ProjectileComponent extends Component {
    isFriendly: boolean;
    hitPercentDamage: number;
    duration: number;
    startTime: number;

    constructor(isFriendly = false, hitPercentDamage = 0, duration = 0) {
        super();
        this.isFriendly = isFriendly;
        this.hitPercentDamage = hitPercentDamage;
        this.duration = duration;
        this.startTime = performance.now();
    }
}
