import ProjectileComponent from '../components/ProjectileComponent';
import System from '../ecs/System';

export default class ProjectileLifecycleSystem extends System {
    constructor() {
        super();
        this.requireComponent(ProjectileComponent);
    }

    update() {
        for (const entity of this.getSystemEntities()) {
            const projectile = entity.getComponent(ProjectileComponent);

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
