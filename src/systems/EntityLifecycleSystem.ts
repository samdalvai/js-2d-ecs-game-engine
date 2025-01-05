import DurationComponent from '../components/DurationComponent';
import System from '../ecs/System';

export default class EntityLifecycleSystem extends System {
    constructor() {
        super();
        this.requireComponent(DurationComponent);
    }

    update() {
        for (const entity of this.getSystemEntities()) {
            const duration = entity.getComponent(DurationComponent);

            if (!duration) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            // Kill projectiles after they reach their duration limit
            if (performance.now() - duration.startTime > duration.duration) {
                entity.kill();
            }
        }
    }
}
