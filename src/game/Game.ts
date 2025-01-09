import AssetStore from '../asset-store/AssetStore';
import CameraFollowComponent from '../components/CameraFollowComponent';
import Registry from '../ecs/Registry';
import EventBus from '../event-bus/EventBus';
import KeyPressedEvent from '../events/KeyPressedEvent';
import KeyReleasedEvent from '../events/KeyReleasedEvent';
import InputManager from '../input-manager/InputManager';
import AnimationSystem from '../systems/AnimationSystem';
import CameraMovementSystem from '../systems/CameraMovementSystem';
import CameraShakeSystem from '../systems/CameraShakeSystem';
import CollisionSystem from '../systems/CollisionSystem';
import DamageSystem from '../systems/DamageSystem';
import ExplosionOnDeathSystem from '../systems/ExplosionOnDeathSystem';
import ExplosionOnHitSystem from '../systems/ExplosionOnHitSystem';
import KeyboardControlSystem from '../systems/KeyboardControlSystem';
import LifetimeSystem from '../systems/LifetimeSystem';
import MovementSystem from '../systems/MovementSystem';
import ProjectileEmitSystem from '../systems/ProjectileEmitSystem';
import RenderColliderSystem from '../systems/RenderColliderSystem';
import RenderHealthBarSystem from '../systems/RenderHealthBarSystem';
import RenderSystem from '../systems/RenderSystem';
import { Rect } from '../types';
import { sleep } from '../utils/time';
import LevelLoader from './LevelLoader';

const FPS = 60;
const MILLISECS_PER_FRAME = 1000 / FPS;

export default class Game {
    private isRunning: boolean;
    private isDebug: boolean;
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private camera: Rect;
    private millisecsPreviousFrame = 0;
    private millisecondsLastFPSUpdate = 0;
    private currentFPS = 0;
    private registry: Registry;
    private assetStore: AssetStore;
    private eventBus: EventBus;
    private inputManager: InputManager;

    static mapWidth: number;
    static mapHeight: number;

    constructor() {
        this.isRunning = false;
        this.isDebug = false;
        this.canvas = null;
        this.ctx = null;
        this.camera = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
        this.registry = new Registry();
        this.assetStore = new AssetStore();
        this.eventBus = new EventBus();
        this.inputManager = new InputManager();
    }

    private resize = (canvas: HTMLCanvasElement, camera: Rect) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        camera.width = window.innerWidth;
        camera.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        // If this is not disabled the browser might use interpolation to smooth the scaling,
        // which can cause visible borders or artifacts, e.g. when rendering tiles
        ctx.imageSmoothingEnabled = false;
    };

    initialize = () => {
        console.log('Initializing game');
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        this.resize(canvas, this.camera);

        this.canvas = canvas;
        this.ctx = ctx;
        this.isRunning = true;

        window.addEventListener('resize', () => {
            if (this.canvas && this.camera) {
                this.resize(this.canvas, this.camera);
            }
        });
    };

    private setup = () => {
        this.registry.addSystem(RenderSystem);
        this.registry.addSystem(MovementSystem);
        this.registry.addSystem(CameraMovementSystem);
        this.registry.addSystem(KeyboardControlSystem);
        this.registry.addSystem(AnimationSystem);
        this.registry.addSystem(RenderColliderSystem);
        this.registry.addSystem(CollisionSystem);
        this.registry.addSystem(RenderHealthBarSystem);
        this.registry.addSystem(ProjectileEmitSystem);
        this.registry.addSystem(DamageSystem, this.eventBus);
        this.registry.addSystem(LifetimeSystem);
        this.registry.addSystem(ExplosionOnDeathSystem);
        this.registry.addSystem(ExplosionOnHitSystem);
        this.registry.addSystem(CameraShakeSystem);

        const loader = new LevelLoader();
        loader.loadLevel(this.registry, this.assetStore);
    };

    private processInput = () => {
        while (this.inputManager.inputBuffer.length > 0) {
            const inputEvent = this.inputManager.inputBuffer.shift();

            if (!inputEvent) {
                return;
            }

            switch (inputEvent.type) {
                case 'keydown':
                    if (inputEvent.code === 'F2') {
                        this.isDebug = !this.isDebug;
                    }

                    this.eventBus.emitEvent(KeyPressedEvent, inputEvent.code);
                    break;
                case 'keyup':
                    this.eventBus.emitEvent(KeyReleasedEvent, inputEvent.code);
                    break;
            }
        }
    };

    private update = async () => {
        // If we are too fast, waste some time until we reach the MILLISECS_PER_FRAME
        const timeToWait = MILLISECS_PER_FRAME - (performance.now() - this.millisecsPreviousFrame);
        if (timeToWait > 0 && timeToWait <= MILLISECS_PER_FRAME) {
            await sleep(timeToWait);
        }

        // The difference in milliseconds since the last frame, converted to seconds
        const deltaTime = (performance.now() - this.millisecsPreviousFrame) / 1000.0;

        if (this.isDebug) {
            const millisecsCurrentFrame = performance.now();
            if (millisecsCurrentFrame - this.millisecondsLastFPSUpdate >= 1000) {
                this.currentFPS = 1000 / (millisecsCurrentFrame - this.millisecsPreviousFrame);
                this.millisecondsLastFPSUpdate = millisecsCurrentFrame;
            }
        }

        this.millisecsPreviousFrame = performance.now();

        // Reset all event handlers for the current frame
        this.eventBus.reset();

        this.registry.update();

        // Perform the subscription of the events for all systems
        this.registry.getSystem(KeyboardControlSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(MovementSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(ProjectileEmitSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(DamageSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(ExplosionOnDeathSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(ExplosionOnHitSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(CameraShakeSystem)?.subscribeToEvents(this.eventBus);

        // Invoke all the systems that need to update
        this.registry.getSystem(MovementSystem)?.update(deltaTime, Game.mapWidth, Game.mapHeight);
        this.registry.getSystem(CameraMovementSystem)?.update(this.camera);
        this.registry.getSystem(CollisionSystem)?.update(this.eventBus);
        this.registry.getSystem(KeyboardControlSystem)?.update();
        this.registry.getSystem(ProjectileEmitSystem)?.update(this.registry);
        this.registry.getSystem(LifetimeSystem)?.update();
    };

    private render = () => {
        if (!this.canvas || !this.ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        // Clear the whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.registry.getSystem(RenderSystem)?.update(this.ctx, this.assetStore, this.camera);
        this.registry.getSystem(AnimationSystem)?.update();
        this.registry.getSystem(RenderHealthBarSystem)?.update(this.ctx, this.camera);
        this.registry.getSystem(CameraShakeSystem)?.update(this.ctx);

        if (this.isDebug) {
            const padding = 25;
            const x = this.canvas.width - padding;
            const y = padding;

            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = 'lightgreen';
            this.ctx.fillText(`Current FPS: (${this.currentFPS.toFixed(2)})`, x, y);

            this.registry.getSystem(RenderColliderSystem)?.update(this.ctx, this.camera);
        }
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
