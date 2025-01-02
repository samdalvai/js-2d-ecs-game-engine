export default class InputManager {
    inputBuffer: KeyboardEvent[];

    constructor() {
        this.inputBuffer = [];
        window.addEventListener('keydown', this.handleEvent);
        window.addEventListener('keyup', this.handleEvent);
    }

    handleEvent = (event: KeyboardEvent) => {
        this.inputBuffer.push(event);
    };
}
