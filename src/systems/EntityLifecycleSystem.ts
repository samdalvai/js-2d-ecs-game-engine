import DurationComponent from '../components/DurationComponent';
import System from '../ecs/System';

export default class EntityLifecycleSystem extends System {
    constructor() {
        super();
        this.requireComponent(DurationComponent);
    }

    update() {
        for (const entity of this.getSystemEntities()) {
            const projectile = entity.getComponent(DurationComponent);

            if (!projectile) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            // Kill projectiles after they reach their duration limit
            if (performance.now() - projectile.startTime > projectile.duration) {
                entity.kill();
            }
        }
    }
}
