import KeyboardControlComponent from '../components/KeyboardControlComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import KeyPressedEvent from '../events/KeyPressedEvent';
import KeyReleasedEvent from '../events/KeyReleasedEvent';

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
            const rigidbody = entity.getComponent(RigidBodyComponent);

            if (!keyboardControl || !sprite || !rigidbody) {
                throw new Error('Could not find some component(s) of entity with id ' + entity.getId());
            }

            if (this.keysPressed.length == 0) {
                rigidbody.velocity = { x: 0, y: 0 };
            } else {
                switch (this.keysPressed[this.keysPressed.length - 1]) {
                    case MovementDirection.UP:
                        this.accellerateEntity(rigidbody, keyboardControl, MovementDirection.UP);
                        rigidbody.direction = { x: 0, y: -1 };
                        sprite.srcRect.y = sprite.height * 0;
                        break;
                    case MovementDirection.RIGHT:
                        this.accellerateEntity(rigidbody, keyboardControl, MovementDirection.RIGHT);
                        rigidbody.direction = { x: 1, y: 0 };
                        sprite.srcRect.y = sprite.height * 1;
                        break;
                    case MovementDirection.DOWN:
                        this.accellerateEntity(rigidbody, keyboardControl, MovementDirection.DOWN);
                        rigidbody.direction = { x: 0, y: 1 };
                        sprite.srcRect.y = sprite.height * 2;
                        break;
                    case MovementDirection.LEFT:
                        this.accellerateEntity(rigidbody, keyboardControl, MovementDirection.LEFT);
                        rigidbody.direction = { x: -1, y: 0 };
                        sprite.srcRect.y = sprite.height * 3;
                        break;
                    default:
                        break;
                }
                console.log('rigidBody: ', rigidbody);
            }
        }
    };

    accellerateEntity = (
        rigidBody: RigidBodyComponent,
        keyboardControl: KeyboardControlComponent,
        movementDirection: MovementDirection,
    ) => {
        switch (movementDirection) {
            case MovementDirection.UP:
                rigidBody.velocity.x = 0;
                rigidBody.velocity.y -=
                    rigidBody.velocity.y - keyboardControl.accelleration > keyboardControl.upVelocity
                        ? keyboardControl.accelleration
                        : rigidBody.velocity.y - keyboardControl.upVelocity;
                break;
            case MovementDirection.RIGHT:
                rigidBody.velocity.y = 0;
                rigidBody.velocity.x +=
                    rigidBody.velocity.x + keyboardControl.accelleration < keyboardControl.rightVelocity
                        ? keyboardControl.accelleration
                        : keyboardControl.rightVelocity - rigidBody.velocity.x;
                break;
            case MovementDirection.DOWN:
                rigidBody.velocity.x = 0;
                rigidBody.velocity.y +=
                    rigidBody.velocity.y + keyboardControl.accelleration < keyboardControl.downVelocity
                        ? keyboardControl.accelleration
                        : keyboardControl.downVelocity - rigidBody.velocity.y;
                break;
            case MovementDirection.LEFT:
                rigidBody.velocity.y = 0;
                rigidBody.velocity.x -=
                    rigidBody.velocity.x - keyboardControl.accelleration > keyboardControl.leftVelocity
                        ? keyboardControl.accelleration
                        : rigidBody.velocity.x - keyboardControl.leftVelocity;
                break;
            default:
                break;
        }
    };
}
