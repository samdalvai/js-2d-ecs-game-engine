import System from '../ecs/System';

export default class CameraShakeSystem extends System {
    shaking = true;
    shakeStartTime = performance.now();

    constructor() {
        super();
    }

    update(ctx: CanvasRenderingContext2D) {
        if (!this.shaking) {
            return;
        }

        const elapsed = performance.now() - this.shakeStartTime;

        // Stop shaking if duration exceeded
        if (elapsed > 1000) {
            this.shaking = false;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return;
        }

        // Apply random shake
        const { x, y } = this.generateRandomMovement(50);
        ctx.setTransform(1, 0, 0, 1, x, y);
    }

    generateRandomMovement(maxMovement: number) {
        const x = Math.floor(Math.random() * (maxMovement * 2 + 1)) - maxMovement;
        const y = Math.floor(Math.random() * (maxMovement * 2 + 1)) - maxMovement;

        return { x, y };
    }
}
