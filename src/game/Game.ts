import AssetStore from '../asset-store/AssetStore';
import SpriteComponent from '../components/SpriteComponent';
import Registry from '../ecs/Registry';
import RenderSystem from '../systems/RenderSystem';
import { sleep } from '../utils/time';

import chopperSpriteSheet from '../../assets/images/chopper-green-spritesheet.png';

const FPS = 60;
const MILLISECS_PER_FRAME = 1000 / FPS;

export default class Game {
    isRunning: boolean;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    millisecsPreviousFrame = 0;
    millisecondsLastFPSUpdate = 0;

    registry: Registry | null;
    assetStore: AssetStore;

    constructor() {
        this.isRunning = false;
        this.canvas = null;
        this.ctx = null;
        this.registry = new Registry();
        this.assetStore = new AssetStore();
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

    setup = () => {
        this.registry?.addSystem(RenderSystem);

        const entity = this.registry?.createEntity();
        entity?.addComponent(SpriteComponent);

        this.assetStore.addTexture('chopper', chopperSpriteSheet);
    };

    processInput = () => {};

    update = async () => {
        // If we are too fast, waste some time until we reach the MILLISECS_PER_FRAME
        const timeToWait = MILLISECS_PER_FRAME - (performance.now() - this.millisecsPreviousFrame);
        if (timeToWait > 0 && timeToWait <= MILLISECS_PER_FRAME) {
            await sleep(timeToWait);
        }

        // The difference in milliseconds since the last frame, converted to seconds
        //const deltaTime = (performance.now() - this.millisecsPreviousFrame) / 1000.0;

        const millisecsCurrentFrame = performance.now();
        if (millisecsCurrentFrame - this.millisecondsLastFPSUpdate >= 1000) {
            const currentFPS = 1000 / (millisecsCurrentFrame - this.millisecsPreviousFrame);
            this.millisecondsLastFPSUpdate = millisecsCurrentFrame;
            console.log('FPS: ' + currentFPS);
        }

        this.millisecsPreviousFrame = performance.now();

        this.registry?.update();
    };

    render = () => {
        if (!this.canvas || !this.ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        // Clear the whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.registry?.getSystem(RenderSystem)?.update(this.ctx, this.assetStore);
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
