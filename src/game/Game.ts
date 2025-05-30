import AssetStore from '../asset-store/AssetStore';
import Registry from '../ecs/Registry';
import EventBus from '../event-bus/EventBus';
import KeyPressedEvent from '../events/KeyPressedEvent';
import KeyReleasedEvent from '../events/KeyReleasedEvent';
import MouseClickEvent from '../events/MouseClickEvent';
import InputManager from '../input-manager/InputManager';
import AnimationSystem from '../systems/AnimationSystem';
import CameraMovementSystem from '../systems/CameraMovementSystem';
import CameraShakeSystem from '../systems/CameraShakeSystem';
import CollisionSystem from '../systems/CollisionSystem';
import DamageSystem from '../systems/DamageSystem';
import EntityFollowSystem from '../systems/EntityFollowSystem';
import ExplosionOnDeathSystem from '../systems/ExplosionOnDeathSystem';
import ExplosionOnHitSystem from '../systems/ExplosionOnHitSystem';
import GameEndSystem from '../systems/GameEndSystem';
import KeyboardControlSystem from '../systems/KeyboardControlSystem';
import LifetimeSystem from '../systems/LifeTimeSystem';
import MovementSystem from '../systems/MovementSystem';
import PlayerDetectionSystem from '../systems/PlayerDetectionSystem';
import ProjectileEmitSystem from '../systems/ProjectileEmitSystem';
import RenderColliderSystem from '../systems/RenderColliderSystem';
import RenderDebugInfoSystem from '../systems/RenderDebugInfoSystem';
import RenderHealthBarSystem from '../systems/RenderHealthBarSystem';
import RenderMenuSystem from '../systems/RenderMenuSystem';
import RenderPlayerFollowRadius from '../systems/RenderPlayerFollowRadius';
import RenderSystem from '../systems/RenderSystem';
import RenderTextSystem from '../systems/RenderTextSystem';
import ScriptingSystem from '../systems/ScriptingSystem';
import SoundSystem from '../systems/SoundSystem';
import SpriteDirectionSystem from '../systems/SpriteDirectionSystem';
import { GameStatus, Rectangle } from '../types';
import { sleep } from '../utils/time';
import LevelLoader from './LevelLoader';

const FPS = 60;
const MILLISECS_PER_FRAME = 1000 / FPS;

export default class Game {
    private isRunning: boolean;
    private isDebug: boolean;
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private camera: Rectangle;
    private millisecsPreviousFrame = 0;
    private millisecondsLastFPSUpdate = 0;
    private currentFPS = 0;
    private registry: Registry;
    private assetStore: AssetStore;
    private eventBus: EventBus;
    private inputManager: InputManager;

    static mapWidth: number;
    static mapHeight: number;
    static windowWidth: number;
    static windowHeight: number;
    static gameStatus: GameStatus;

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

    private resize = (canvas: HTMLCanvasElement, camera: Rectangle) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        camera.width = window.innerWidth;
        camera.height = window.innerHeight;

        Game.windowWidth = window.innerWidth;
        Game.windowHeight = window.innerHeight;

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

    private setup = async () => {
        this.registry.addSystem(RenderSystem);
        this.registry.addSystem(RenderColliderSystem);
        this.registry.addSystem(RenderHealthBarSystem);
        this.registry.addSystem(RenderTextSystem);
        this.registry.addSystem(RenderDebugInfoSystem);
        this.registry.addSystem(RenderMenuSystem, this.registry, this.assetStore);

        this.registry.addSystem(MovementSystem);
        this.registry.addSystem(CameraMovementSystem);
        this.registry.addSystem(KeyboardControlSystem);
        this.registry.addSystem(AnimationSystem);
        this.registry.addSystem(CollisionSystem);
        this.registry.addSystem(ProjectileEmitSystem, this.registry);
        this.registry.addSystem(DamageSystem, this.eventBus);
        this.registry.addSystem(LifetimeSystem);
        this.registry.addSystem(ExplosionOnDeathSystem);
        this.registry.addSystem(ExplosionOnHitSystem);
        this.registry.addSystem(CameraShakeSystem);
        this.registry.addSystem(SoundSystem, this.assetStore);
        this.registry.addSystem(RenderPlayerFollowRadius);
        this.registry.addSystem(EntityFollowSystem);
        this.registry.addSystem(PlayerDetectionSystem);
        this.registry.addSystem(SpriteDirectionSystem);
        this.registry.addSystem(ScriptingSystem);
        this.registry.addSystem(GameEndSystem);

        await LevelLoader.loadLevel(this.registry, this.assetStore);
        Game.gameStatus = GameStatus.PLAYING;
    };

    private processInput = () => {
        // Hanlde keyboard events
        while (this.inputManager.keyboardInputBuffer.length > 0) {
            const inputEvent = this.inputManager.keyboardInputBuffer.shift();

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

        // Handle mouse events
        while (this.inputManager.mouseInputBuffer.length > 0) {
            const inputEvent = this.inputManager.mouseInputBuffer.shift();

            if (!inputEvent) {
                return;
            }

            this.eventBus.emitEvent(MouseClickEvent, { x: inputEvent.x, y: inputEvent.y });
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

        this.registry.getSystem(GameEndSystem)?.update();

        if (Game.gameStatus !== GameStatus.PLAYING) {
            this.registry.getSystem(RenderMenuSystem)?.subscribeToEvents(this.eventBus);
            return;
        }

        // Perform the subscription of the events for all systems
        this.registry.getSystem(MovementSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(KeyboardControlSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(ProjectileEmitSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(DamageSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(ExplosionOnDeathSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(ExplosionOnHitSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(CameraShakeSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(SoundSystem)?.subscribeToEvents(this.eventBus);
        this.registry.getSystem(PlayerDetectionSystem)?.subscribeToEvents(this.eventBus);

        // Invoke all the systems that need to update
        this.registry.getSystem(PlayerDetectionSystem)?.update(this.registry);
        this.registry.getSystem(ScriptingSystem)?.update();
        this.registry.getSystem(EntityFollowSystem)?.update();
        this.registry.getSystem(MovementSystem)?.update(deltaTime);
        this.registry.getSystem(CameraMovementSystem)?.update(this.camera);
        this.registry.getSystem(CollisionSystem)?.update(this.eventBus);
        this.registry.getSystem(KeyboardControlSystem)?.update();
        this.registry.getSystem(ProjectileEmitSystem)?.update(this.registry);
        this.registry.getSystem(LifetimeSystem)?.update();
        this.registry.getSystem(SoundSystem)?.update(this.assetStore);
    };

    private render = () => {
        if (!this.canvas || !this.ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        // Clear the whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.registry.getSystem(RenderSystem)?.update(this.ctx, this.assetStore, this.camera);
        this.registry.getSystem(AnimationSystem)?.update();
        this.registry.getSystem(SpriteDirectionSystem)?.update();
        this.registry.getSystem(RenderHealthBarSystem)?.update(this.ctx, this.camera);
        this.registry.getSystem(CameraShakeSystem)?.update(this.ctx);
        this.registry.getSystem(RenderTextSystem)?.update(this.ctx, this.camera);

        if (this.isDebug) {
            this.registry.getSystem(RenderDebugInfoSystem)?.update(this.ctx, this.currentFPS, this.inputManager);
            this.registry.getSystem(RenderColliderSystem)?.update(this.ctx, this.camera);
            this.registry.getSystem(RenderPlayerFollowRadius)?.update(this.ctx, this.camera);
        }

        if (Game.gameStatus !== GameStatus.PLAYING) {
            this.registry.getSystem(RenderMenuSystem)?.update(this.ctx);
        }
    };

    run = async () => {
        await this.setup();
        console.log('Running game');
        const loop = async () => {
            while (this.isRunning) {
                this.processInput();
                await this.update();
                this.render();
            }
        };
        loop();
    };
}
