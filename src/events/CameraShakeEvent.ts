import GameEvent from '../event-bus/GameEvent.js';

export default class CameraShakeEvent extends GameEvent {
    shakeDuration: number;

    constructor(shakeDuration: number) {
        super();
        this.shakeDuration = shakeDuration;
    }
}
