export default class InputManager {
    inputBuffer: KeyboardEvent[];
    mousePosition: { x: number; y: number };

    constructor() {
        this.inputBuffer = [];
        this.mousePosition = { x: 0, y: 0 };

        window.addEventListener('keydown', this.handleKeyboardEvent);
        window.addEventListener('keyup', this.handleKeyboardEvent);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    handleKeyboardEvent = (event: KeyboardEvent) => {
        this.inputBuffer.push(event);
    };

    handleMouseMove = (event: MouseEvent) => {
        this.mousePosition = { x: event.clientX, y: event.clientY };
    };
}
