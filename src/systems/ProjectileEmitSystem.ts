import BoxColliderComponent from '../components/BoxColliderComponent';
import DurationComponent from '../components/DurationComponent';
import ProjectileComponent from '../components/ProjectileComponent';
import ProjectileEmitterComponent from '../components/ProjectileEmitterComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import Registry from '../ecs/Registry';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import KeyPressedEvent from '../events/KeyPressedEvent';

export default class ProjectileEmitSystem extends System {
    constructor() {
        super();
        this.requireComponent(ProjectileEmitterComponent);
        this.requireComponent(TransformComponent);
    }

    subscribeToEvents(eventBus: EventBus) {
        eventBus.subscribeToEvent(KeyPressedEvent, this, this.onKeyPressed);
    }

    onKeyPressed(event: KeyPressedEvent) {
        if (event.keyCode === 'Space') {
            for (const entity of this.getSystemEntities()) {
                if (entity.hasTag('player')) {
                    const projectileEmitter = entity.getComponent(ProjectileEmitterComponent);
                    const transform = entity.getComponent(TransformComponent);
                    const rigidbody = entity.getComponent(RigidBodyComponent);

                    if (!projectileEmitter || !transform || !rigidbody) {
                        throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
                    }

                    // Limit emission of projectiles to 1 every 0.5 seconds
                    if (performance.now() - projectileEmitter.lastEmissionTime < 500) {
                        continue;
                    }

                    // If parent entity has sprite, start the projectile position in the middle of the entity
                    const projectilePosition = { ...transform.position };
                    if (entity.hasComponent(SpriteComponent)) {
                        const sprite = entity.getComponent(SpriteComponent);
                        if (!sprite) {
                            throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
                        }
                        projectilePosition.x += (transform.scale.x * sprite.width) / 2;
                        projectilePosition.y += (transform.scale.y * sprite.height) / 2;
                    }

                    // If parent entity direction is controlled by the keyboard keys, modify the direction of the projectile accordingly
                    const projectileVelocity = { ...projectileEmitter.projectileVelocity };

                    let directionX = 0;
                    let directionY = 0;

                    if (rigidbody.direction.x > 0) directionX = +1;
                    if (rigidbody.direction.x < 0) directionX = -1;
                    if (rigidbody.direction.y > 0) directionY = +1;
                    if (rigidbody.direction.y < 0) directionY = -1;
                    projectileVelocity.x = projectileEmitter.projectileVelocity.x * directionX + rigidbody.velocity.x;
                    projectileVelocity.y = projectileEmitter.projectileVelocity.y * directionY + rigidbody.velocity.y;

                    // Create new projectile entity and add it to the world
                    const projectile = entity.registry.createEntity();
                    projectile.group('projectiles');
                    projectile.addComponent(TransformComponent, projectilePosition, { x: 1.0, y: 1.0 }, 0.0);
                    projectile.addComponent(RigidBodyComponent, projectileVelocity);
                    projectile.addComponent(SpriteComponent, 'bullet-texture', 4, 4, 4);
                    projectile.addComponent(BoxColliderComponent, 4, 4);
                    projectile.addComponent(
                        ProjectileComponent,
                        projectileEmitter.isFriendly,
                        projectileEmitter.hitPercentDamage,
                    );
                    projectile.addComponent(DurationComponent, projectileEmitter.projectileDuration);

                    projectileEmitter.lastEmissionTime = performance.now();
                }
            }
        }
    }

    update(registry: Registry) {
        for (const entity of this.getSystemEntities()) {
            const projectileEmitter = entity.getComponent(ProjectileEmitterComponent);
            const transform = entity.getComponent(TransformComponent);

            if (!projectileEmitter || !transform) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            // If emission frequency is zero, bypass re-emission logic
            if (projectileEmitter.repeatFrequency == 0) {
                continue;
            }

            // Check if its time to re-emit a new projectile
            if (performance.now() - projectileEmitter.lastEmissionTime > projectileEmitter.repeatFrequency) {
                const projectilePosition = { ...transform.position };
                if (entity.hasComponent(SpriteComponent)) {
                    const sprite = entity.getComponent(SpriteComponent);

                    if (!sprite) {
                        throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
                    }
                    projectilePosition.x += (transform.scale.x * sprite.width) / 2;
                    projectilePosition.y += (transform.scale.y * sprite.height) / 2;
                }

                // Add a new projectile entity to the registry
                const projectile = registry.createEntity();
                projectile.group('projectiles');
                projectile.addComponent(TransformComponent, projectilePosition, { x: 1.0, y: 1.0 }, 0.0);
                projectile.addComponent(RigidBodyComponent, projectileEmitter.projectileVelocity);
                projectile.addComponent(SpriteComponent, 'bullet-texture', 4, 4, 4);
                projectile.addComponent(BoxColliderComponent, 4, 4);
                projectile.addComponent(
                    ProjectileComponent,
                    projectileEmitter.isFriendly,
                    projectileEmitter.hitPercentDamage,
                );
                projectile.addComponent(DurationComponent, projectileEmitter.projectileDuration);

                // Update the projectile emitter component last emission to the current milliseconds
                projectileEmitter.lastEmissionTime = performance.now();
            }
        }
    }
}
