import AssetStore from '../asset-store/AssetStore';
import SpriteComponent from '../components/SpriteComponent';
import Registry from '../ecs/Registry';
import RenderSystem from '../systems/RenderSystem';
import { sleep } from '../utils/time';
import LevelLoader from './LevelLoader';

const FPS = 60;
const MILLISECS_PER_FRAME = 1000 / FPS;

export default class Game {
    isRunning: boolean;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    millisecsPreviousFrame = 0;
    millisecondsLastFPSUpdate = 0;
    static mapWidth: number;
    static mapHeight: number;

    registry: Registry;
    assetStore: AssetStore;

    constructor() {
        this.isRunning = false;
        this.canvas = null;
        this.ctx = null;
        this.registry = new Registry();
        this.assetStore = new AssetStore();
    }

    private resizeCanvas = (canvas: HTMLCanvasElement) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    initialize = () => {
        console.log('Initializing game');
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        this.resizeCanvas(canvas);

        // If this is not disabled the browser might use interpolation to smooth the scaling, 
        // which can cause visible borders or artifacts, e.g. when rendering tiles
        ctx.imageSmoothingEnabled = false;

        this.canvas = canvas;
        this.ctx = ctx;
        this.isRunning = true;

        window.addEventListener('resize', () => {
            if (this.canvas) {
                this.resizeCanvas(this.canvas);
            }
        });
    };

    setup = () => {
        this.registry.addSystem(RenderSystem);

        const loader = new LevelLoader();
        loader.loadLevel(this.registry, this.assetStore);
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
