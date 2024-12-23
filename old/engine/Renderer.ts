export default class Renderer {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    width: number
    height: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const canvasCtx = canvas.getContext('2d')

        if (!canvasCtx) {
            throw new Error("Failed to get 2D context for the canvas.");
        }

        this.ctx = canvasCtx;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    // Clear the canvas for the next frame
    clear(color = 'black') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Draw a rectangle (e.g., for a player or enemy)
    drawRect(x: number, y: number, width: number, height: number, color = 'white') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    // Draw a circle (e.g., for effects or projectiles)
    drawCircle(x: number, y: number, radius: number, color = 'white') {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Draw a line (e.g., for visual guides or debug information)
    drawLine(x1: number, y1: number, x2: number, y2: number, color = 'white', width = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    // Draw an image (e.g., sprite or background)
    drawImage(image: CanvasImageSource, x: number, y: number, width: number, height: number) {
        this.ctx.drawImage(image, x, y, width, height);
    }
}
