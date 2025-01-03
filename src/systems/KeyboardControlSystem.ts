import KeyboardControlComponent from '../components/KeyboardControlComponent';
import RigidBodyComponent from '../components/RigidBodyComponent';
import SpriteComponent from '../components/SpriteComponent';
import System from '../ecs/System';
import EventBus from '../event-bus/EventBus';
import KeyPressedEvent from '../events/KeyPressedEvent';
import KeyReleasedEvent from '../events/KeyReleasedEvent';

enum MovementDirection {
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
            case 'w':
                this.keysPressed.push(MovementDirection.UP);
                break;
            case 'ArrowRight':
            case 'd':
                this.keysPressed.push(MovementDirection.RIGHT);
                break;
            case 'ArrowDown':
            case 's':
                this.keysPressed.push(MovementDirection.DOWN);
                break;
            case 'ArrowLeft':
            case 'a':
                this.keysPressed.push(MovementDirection.LEFT);
                break;
        }
    };

    onKeyReleased = (event: KeyReleasedEvent) => {
        switch (event.keyCode) {
            case 'ArrowUp':
            case 'w':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.UP);
                break;
            case 'ArrowRight':
            case 'd':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.RIGHT);
                break;
            case 'ArrowDown':
            case 's':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.DOWN);
                break;
            case 'ArrowLeft':
            case 'a':
                this.keysPressed = this.keysPressed.filter(key => key !== MovementDirection.LEFT);
                break;
        }
    };

    update = () => {
        for (const entity of this.getSystemEntities()) {
            const keyboardControl = entity.getComponent(KeyboardControlComponent);
            const sprite = entity.getComponent(SpriteComponent);
            const rigidbody = entity.getComponent(RigidBodyComponent);

            if (!keyboardControl) {
                throw new Error('Could not find keyboardControl component of entity with id ' + entity.getId());
            }

            if (!sprite) {
                throw new Error('Could not find sprite component of entity with id ' + entity.getId());
            }

            if (!rigidbody) {
                throw new Error('Could not find rigidbody component of entity with id ' + entity.getId());
            }

            if (this.keysPressed.length == 0) {
                rigidbody.velocity = { x: 0, y: 0 };
            } else {
                switch (this.keysPressed[this.keysPressed.length - 1]) {
                    case MovementDirection.UP:
                        rigidbody.velocity = keyboardControl.upVelocity;
                        rigidbody.direction = { x: 0, y: -1 };
                        sprite.srcRect.y = sprite.height * 0;
                        break;
                    case MovementDirection.RIGHT:
                        rigidbody.velocity = keyboardControl.rightVelocity;
                        rigidbody.direction = { x: 1, y: 0 };
                        sprite.srcRect.y = sprite.height * 1;
                        break;
                    case MovementDirection.DOWN:
                        rigidbody.velocity = keyboardControl.downVelocity;
                        rigidbody.direction = { x: 0, y: 1 };
                        sprite.srcRect.y = sprite.height * 2;
                        break;
                    case MovementDirection.LEFT:
                        rigidbody.velocity = keyboardControl.leftVelocity;
                        rigidbody.direction = { x: -1, y: 0 };
                        sprite.srcRect.y = sprite.height * 3;
                        break;
                    default:
                        break;
                }
            }
        }
    };
}
