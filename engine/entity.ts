export default class Entity {
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
