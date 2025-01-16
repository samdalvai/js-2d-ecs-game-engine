import KeyboardControlComponent from '../components/KeyboardControlComponent.js';
import RigidBodyComponent from '../components/RigidBodyComponent.js';
import SpriteComponent from '../components/SpriteComponent.js';
import System from '../ecs/System.js';
import EventBus from '../event-bus/EventBus.js';
import KeyPressedEvent from '../events/KeyPressedEvent.js';
import KeyReleasedEvent from '../events/KeyReleasedEvent.js';

export enum MovementDirection {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

export default class KeyboardControlSystem extends System {
    keysPressed: MovementDirection[] = [];

    constructor() {
        super();
        this.requireComponent(KeyboardControlComponent);
        this.requireComponent(SpriteComponent);
        this.requireComponent(RigidBodyComponent);
    }

    subscribeToEvents = (eventBus: EventBus) => {
        eventBus.subscribeToEvent(KeyPressedEvent, this, this.onKeyPressed);
        eventBus.subscribeToEvent(KeyReleasedEvent, this, this.onKeyReleased);
    };

    onKeyPressed = (event: KeyPressedEvent) => {
        switch (event.keyCode) {
            case 'ArrowUp':
            case 'KeyW':
                this.keysPressed.push(MovementDirection.UP);
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keysPressed.push(MovementDirection.RIGHT);
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keysPressed.push(MovementDirection.DOWN);
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keysPressed.push(MovementDirection.LEFT);
                break;
        }
    };

    onKeyReleased = (event: KeyReleasedEvent) => {
        switch (event.keyCode) {
            case 'ArrowUp':
            case 'KeyW':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.UP);
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.RIGHT);
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.DOWN);
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.LEFT);
                break;
        }
    };

    update = () => {
        for (const entity of this.getSystemEntities()) {
            const keyboardControl = entity.getComponent(KeyboardControlComponent);
            const sprite = entity.getComponent(SpriteComponent);
            const rigidBody = entity.getComponent(RigidBodyComponent);

            if (!keyboardControl || !sprite || !rigidBody) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            if (this.keysPressed.length == 0) {
                rigidBody.velocity = { x: 0, y: 0 };
            } else {
                this.updateEntityMovement(
                    rigidBody,
                    keyboardControl,
                    sprite,
                    this.keysPressed[this.keysPressed.length - 1],
                );
            }
        }
    };

    updateEntityMovement = (
        rigidBody: RigidBodyComponent,
        keyboardControl: KeyboardControlComponent,
        sprite: SpriteComponent,
        movementDirection: MovementDirection,
    ) => {
        switch (movementDirection) {
            case MovementDirection.UP:
                rigidBody.velocity.x = 0;
                rigidBody.velocity.y = keyboardControl.upVelocity;
                rigidBody.direction = { x: 0, y: -1 };
                sprite.srcRect.y = sprite.height * 0;
                break;
            case MovementDirection.RIGHT:
                rigidBody.velocity.y = 0;
                rigidBody.velocity.x = keyboardControl.rightVelocity;
                rigidBody.direction = { x: 1, y: 0 };
                sprite.srcRect.y = sprite.height * 1;
                break;
            case MovementDirection.DOWN:
                rigidBody.velocity.x = 0;
                rigidBody.velocity.y = keyboardControl.downVelocity;
                rigidBody.direction = { x: 0, y: 1 };
                sprite.srcRect.y = sprite.height * 2;
                break;
            case MovementDirection.LEFT:
                rigidBody.velocity.y = 0;
                rigidBody.velocity.x = keyboardControl.leftVelocity;
                rigidBody.direction = { x: -1, y: 0 };
                sprite.srcRect.y = sprite.height * 3;
                break;
            default:
                break;
        }
    };
}
