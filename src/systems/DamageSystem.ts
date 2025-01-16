import BoxColliderComponent from '../components/BoxColliderComponent.js';
import CameraShakeComponent from '../components/CameraShakeComponent.js';
import HealthComponent from '../components/HealthComponent.js';
import ProjectileComponent from '../components/ProjectileComponent.js';
import TransformComponent from '../components/TransformComponent.js';
import Entity from '../ecs/Entity.js';
import System from '../ecs/System.js';
import EventBus from '../event-bus/EventBus.js';
import CameraShakeEvent from '../events/CameraShakeEvent.js';
import CollisionEvent from '../events/CollisionEvent.js';
import EntityHitEvent from '../events/EntityHitEvent.js';
import EntityKilledEvent from '../events/EntityKilledEvent.js';

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

            if (player.hasComponent(CameraShakeComponent)) {
                const cameraShake = player.getComponent(CameraShakeComponent);

                if (!cameraShake) {
                    throw new Error('Could not find some component(s) of entity with id ' + player.getId());
                }

                this.eventBus.emitEvent(CameraShakeEvent, cameraShake.shakeDuration);
            }

            if (projectile.hasComponent(TransformComponent)) {
                const transform = projectile.getComponent(TransformComponent);

                if (!transform) {
                    throw new Error('Could not find some component(s) of entity with id ' + projectile.getId());
                }

                this.eventBus.emitEvent(EntityHitEvent, player, transform.position);
            }
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

            if (projectile.hasComponent(TransformComponent)) {
                const transform = projectile.getComponent(TransformComponent);

                if (!transform) {
                    throw new Error('Could not find some component(s) of entity with id ' + projectile.getId());
                }

                this.eventBus.emitEvent(EntityHitEvent, enemy, transform.position);
            }
        }
    }
}
