import Game from "./src/game/Game";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error("Failed to get 2D context for the canvas.");
}

const game = new Game(canvas, ctx)

game.initialize()
game.run()
game.destroy()