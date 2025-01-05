import BoxColliderComponent from '../components/BoxColliderComponent';
import HealthComponent from '../components/HealthComponent';
import ProjectileComponent from '../components/ProjectileComponent';
import Entity from '../ecs/Entity';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import CollisionEvent from '../events/CollisionEvent';
import EntityKilledEvent from '../events/EntityKilledEvent';

export default class DamageSystem extends System {
    eventBus: EventBus;

    constructor(eventBus: EventBus) {
        super();
        this.eventBus = eventBus;
        this.requireComponent(BoxColliderComponent);
    }

    subscribeToEvents(eventBus: EventBus) {
        eventBus.subscribeToEvent(CollisionEvent, this, this.onCollision);
    }

    onCollision(event: CollisionEvent) {
        const a = event.a;
        const b = event.b;

        if (a.belongsToGroup('projectiles') && b.hasTag('player')) {
            this.onProjectileHitsPlayer(a, b);
        }

        if (b.belongsToGroup('projectiles') && a.hasTag('player')) {
            this.onProjectileHitsPlayer(b, a);
        }

        if (a.belongsToGroup('projectiles') && b.belongsToGroup('enemies')) {
            this.onProjectileHitsEnemy(a, b);
        }

        if (b.belongsToGroup('projectiles') && a.belongsToGroup('enemies')) {
            this.onProjectileHitsEnemy(b, a);
        }
    }

    onProjectileHitsPlayer(projectile: Entity, player: Entity) {
        const projectileComponent = projectile.getComponent(ProjectileComponent);

        if (!projectileComponent) {
            throw new Error('Could not find some component(s) of entity with id ' + projectile.getId());
        }

        if (!projectileComponent.isFriendly && player.hasComponent(HealthComponent)) {
            const health = player.getComponent(HealthComponent);

            if (!health) {
                throw new Error('Could not find some component(s) of entity with id ' + player.getId());
            }

            health.healthPercentage -= projectileComponent.hitPercentDamage;

            if (health.healthPercentage <= 0) {
                this.eventBus.emitEvent(EntityKilledEvent, player);
                player.kill();
            }

            projectile.kill();
        }
    }

    onProjectileHitsEnemy(projectile: Entity, enemy: Entity) {
        const projectileComponent = projectile.getComponent(ProjectileComponent);

        if (!projectileComponent) {
            throw new Error('Could not find some component(s) of entity with id ' + projectile.getId());
        }

        if (projectileComponent.isFriendly && enemy.hasComponent(HealthComponent)) {
            const health = enemy.getComponent(HealthComponent);

            if (!health) {
                throw new Error('Could not find some component(s) of entity with id ' + enemy.getId());
            }

            health.healthPercentage -= projectileComponent.hitPercentDamage;

            if (health.healthPercentage <= 0) {
                this.eventBus.emitEvent(EntityKilledEvent, enemy);
                enemy.kill();
            }

            projectile.kill();
        }
    }
}
