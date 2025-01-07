import AnimationComponent from '../components/AnimationComponent';
import ExplosionComponent from '../components/ExplosionComponent';
import LifetimeComponent from '../components/LifetimeComponent';
import SpriteComponent from '../components/SpriteComponent';
import TransformComponent from '../components/TransformComponent';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import EntityKilledEvent from '../events/EntityKilledEvent';

export default class ExplosionAnimationSystem extends System {
    constructor() {
        super();
    }

    subscribeToEvents = (eventBus: EventBus) => {
        eventBus.subscribeToEvent(EntityKilledEvent, this, this.onEntityKilled);
    };

    onEntityKilled = (event: EntityKilledEvent) => {
        console.log('Entity killed: ', event.entity);
        const entity = event.entity;

        if (
            entity.hasComponent(ExplosionComponent) &&
            entity.hasComponent(TransformComponent) &&
            entity.hasComponent(SpriteComponent)
        ) {
            const explosion = entity.getComponent(ExplosionComponent);
            const transform = entity.getComponent(TransformComponent);
            const sprite = entity.getComponent(SpriteComponent);

            if (!explosion || !transform || !sprite) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            const explosionAnimation = entity.registry.createEntity();
            explosionAnimation.addComponent(
                TransformComponent,
                {
                    x: transform.position.x - (sprite.width * transform.scale.x) / 2,
                    y: transform.position.y - (sprite.height * transform.scale.y) / 2,
                },
                { x: transform.scale.x * 2, y: transform.scale.y * 2 },
                0,
            );
            explosionAnimation.addComponent(SpriteComponent, 'explosion-texture', 32, 32, 1, 0);
            explosionAnimation.addComponent(AnimationComponent, 11, 10, false);
            explosionAnimation.addComponent(LifetimeComponent, 1000);
        }
    };
}
