import { sleep } from '../utils/time';

const FPS = 60;
const MILLISECS_PER_FRAME = 1000 / FPS;

export default class Game {
    isRunning: boolean;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    millisecsPreviousFrame = 0;
    millisecondsLastFPSUpdate = 0;

    constructor() {
        this.isRunning = false;
        this.canvas = null;
        this.ctx = null;
    }

    initialize = () => {
        console.log('Initializing game');
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        this.canvas = canvas;
        this.ctx = ctx;
        this.isRunning = true;
    };

    setup = () => { };

    processInput = () => { };

    update = async () => {
        // If we are too fast, waste some time until we reach the MILLISECS_PER_FRAME
        const timeToWait = MILLISECS_PER_FRAME - (performance.now() - this.millisecsPreviousFrame);
        if (timeToWait > 0 && timeToWait <= MILLISECS_PER_FRAME) {
            await sleep(timeToWait);
        }

        // The difference in ticks since the last frame, converted to seconds
        const deltaTime = (performance.now() - this.millisecsPreviousFrame) / 1000.0;

        const millisecsCurrentFrame = performance.now();
        if (millisecsCurrentFrame - this.millisecondsLastFPSUpdate >= 1000) {
            const currentFPS = 1000 / (millisecsCurrentFrame - this.millisecsPreviousFrame);
            this.millisecondsLastFPSUpdate = millisecsCurrentFrame;
            console.log('FPS: ' + currentFPS);
        }

        this.millisecsPreviousFrame = performance.now();
    };

    render = () => {
        if (!this.canvas || !this.ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        // Clear the whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render entities
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(100, 100, 50, 50);
    };

    run = () => {
        console.log('Running game');
        this.setup();
        const loop = async () => {
            while (this.isRunning) {
                this.processInput();
                await this.update();
                this.render();
            }
        };
        loop();
    };

    destroy = () => {
        console.log('Destroying game');
    };
}
