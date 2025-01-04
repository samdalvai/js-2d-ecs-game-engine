import BoxColliderComponent from '../components/BoxColliderComponent';
import ProjectileComponent from '../components/ProjectileComponent';
import ProjectileEmitterComponent from '../components/ProjectileEmitterComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
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
                    projectileVelocity.x = projectileEmitter.projectileVelocity.x * directionX;
                    projectileVelocity.y = projectileEmitter.projectileVelocity.y * directionY;

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
                        projectileEmitter.projectileDuration,
                    );
                }
            }
        }
    }

    /*void Update(std::unique_ptr<Registry>& registry) {
            for (auto entity: GetSystemEntities()) {
                auto& projectileEmitter = entity.GetComponent<ProjectileEmitterComponent>();
                const auto transform = entity.GetComponent<TransformComponent>();

                // If emission frequency is zero, bypass re-emission logic
                if (projectileEmitter.repeatFrequency == 0) {
                    continue;
                }

                // Check if its time to re-emit a new projectile
                if (SDL_GetTicks() - projectileEmitter.lastEmissionTime > projectileEmitter.repeatFrequency) {
                    glm::vec2 projectilePosition = transform.position;
                    if (entity.HasComponent<SpriteComponent>()) {
                        const auto sprite = entity.GetComponent<SpriteComponent>();
                        projectilePosition.x += (transform.scale.x * sprite.width / 2);
                        projectilePosition.y += (transform.scale.y * sprite.height / 2);
                    }

                    // Add a new projectile entity to the registry
                    Entity projectile = registry->CreateEntity();
                    projectile.Group("projectiles");
                    projectile.AddComponent<TransformComponent>(projectilePosition, glm::vec2(1.0, 1.0), 0.0);
                    projectile.AddComponent<RigidBodyComponent>(projectileEmitter.projectileVelocity);
                    projectile.AddComponent<SpriteComponent>("bullet-texture", 4, 4, 4);
                    projectile.AddComponent<BoxColliderComponent>(4, 4);
                    projectile.AddComponent<ProjectileComponent>(projectileEmitter.isFriendly, projectileEmitter.hitPercentDamage, projectileEmitter.projectileDuration);
                
                    // Update the projectile emitter component last emission to the current milliseconds
                    projectileEmitter.lastEmissionTime = SDL_GetTicks();
                }
            }
        }*/
}
