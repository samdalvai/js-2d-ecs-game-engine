export default class InputManager {
    private keys: { [key: string]: boolean };

    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e: KeyboardEvent) => (this.keys[e.key] = true));
        window.addEventListener('keyup', (e: KeyboardEvent) => (this.keys[e.key] = false));
    }

    isKeyPressed(key: string) {
        return !!this.keys[key];
    }
}