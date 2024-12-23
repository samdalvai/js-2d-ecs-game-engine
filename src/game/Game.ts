export default class Game {
    isRunning: boolean;
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;

    constructor() {
        this.isRunning = false;
        this.canvas = null;
        this.ctx = null;
    }

    initialize = () => {
        console.log('Initializing game');
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get 2D context for the canvas.');
        }

        this.canvas = canvas;
        this.ctx = ctx;
        this.isRunning = true;
    };

    run = () => {
        console.log('Running game');
    };

    destroy = () => {
        console.log('Destroying game');
        this.canvas = null;
        this.ctx = null;
    };
}
