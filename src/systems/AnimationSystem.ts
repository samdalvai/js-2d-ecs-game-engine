import AnimationComponent from '../components/AnimationComponent';
import SpriteComponent from '../components/SpriteComponent';
import System from '../ecs/System';

export default class AnimationSystem extends System {
    constructor() {
        super();
        this.requireComponent(SpriteComponent);
        this.requireComponent(AnimationComponent);
    }

    update() {
        for (const entity of this.getSystemEntities()) {
            const animation = entity.getComponent(AnimationComponent);
            const sprite = entity.getComponent(SpriteComponent);

            if (!animation) {
                throw new Error('Could not find animation component of entity with id ' + entity.getId());
            }

            if (!sprite) {
                throw new Error('Could not find sprite component of entity with id ' + entity.getId());
            }

            animation.currentFrame =
                Math.round(((performance.now() - animation.startTime) * animation.frameSpeedRate) / 1000) %
                animation.numFrames;
            sprite.srcRect.x = animation.currentFrame * sprite.width;
        }
    }
}
