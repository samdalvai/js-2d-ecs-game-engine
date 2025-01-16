import LifetimeComponent from '../components/LifetimeComponent.js';
import System from '../ecs/System.js';

export default class LifetimeSystem extends System {
    constructor() {
        super();
        this.requireComponent(LifetimeComponent);
    }

    update() {
        for (const entity of this.getSystemEntities()) {
            const lifeTime = entity.getComponent(LifetimeComponent);

            if (!lifeTime) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            // Kill projectiles after they reach their duration limit
            if (performance.now() - lifeTime.startTime > lifeTime.lifetime) {
                entity.kill();
            }
        }
    }
}
