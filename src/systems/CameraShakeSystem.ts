import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import CameraShakeEvent from '../events/CameraShakeEvent';

export default class CameraShakeSystem extends System {
    shaking = false;
    shakeDuration = 0;
    shakeStartTime = 0;

    constructor() {
        super();
    }

    subscribeToEvents = (eventBus: EventBus) => {
        eventBus.subscribeToEvent(CameraShakeEvent, this, this.onCameraShake);
    };

    onCameraShake = (event: CameraShakeEvent) => {
        this.shaking = true;
        this.shakeDuration = event.shakeDuration;
        this.shakeStartTime = performance.now();
    };

    update(ctx: CanvasRenderingContext2D) {
        if (!this.shaking) {
            return;
        }

        const elapsed = performance.now() - this.shakeStartTime;

        // Stop shaking if duration exceeded
        if (elapsed > this.shakeDuration) {
            this.shaking = false;
            this.shakeDuration = 0;
            this.shakeStartTime = 0;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return;
        }

        // Apply random shake
        const { x, y } = this.generateRandomMovement(5);
        ctx.setTransform(1, 0, 0, 1, x, y);
    }

    generateRandomMovement(maxMovement: number) {
        const x = Math.floor(Math.random() * (maxMovement * 2 + 1)) - maxMovement;
        const y = Math.floor(Math.random() * (maxMovement * 2 + 1)) - maxMovement;

        return { x, y };
    }
}
