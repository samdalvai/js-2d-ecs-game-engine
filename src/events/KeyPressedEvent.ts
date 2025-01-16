import GameEvent from '../event-bus/GameEvent.js';

export default class KeyPressedEvent extends GameEvent {
    keyCode: string;

    constructor(keyCode: string) {
        super();
        this.keyCode = keyCode;
    }
}
