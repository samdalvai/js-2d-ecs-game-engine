export default class GameLoop {
    private update: (deltaTime: number) => void;
    private render: () => void;
    private lastTime: number;

    constructor(update: (deltaTime: number) => void, render: () => void) {
        this.update = update;
        this.render = render;
        this.lastTime = 0;
        this.loop = this.loop.bind(this);
    }

    loop(timestamp: number) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop);
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }
}
