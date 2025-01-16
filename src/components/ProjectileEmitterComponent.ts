import Component from '../ecs/Component.js';
import { Vec2 } from '../types/types.js';

export default class ProjectileEmitterComponent extends Component {
    projectileVelocity: Vec2;
    repeatFrequency: number;
    projectileDuration: number;
    hitPercentDamage: number;
    isFriendly: boolean;
    lastEmissionTime: number;

    constructor(
        projectileVelocity = { x: 0, y: 0 },
        repeatFrequency = 0,
        projectileDuration = 10000,
        hitPercentDamage = 10,
        isFriendly = false,
    ) {
        super();
        this.projectileVelocity = projectileVelocity;
        this.repeatFrequency = repeatFrequency;
        this.projectileDuration = projectileDuration;
        this.hitPercentDamage = hitPercentDamage;
        this.isFriendly = isFriendly;
        this.lastEmissionTime = performance.now();
    }
}
