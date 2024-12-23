import GameLoop from './engine/GameLoop';
import InputManager from './engine/InputManager';
import Entity from './engine/Entity';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error("Failed to get 2D context for the canvas.");
}

const input = new InputManager();
const player = new Entity(100, 100);

const update = () => {
    if (input.isKeyPressed('ArrowRight')) player.x += 5;
    if (input.isKeyPressed('ArrowLeft')) player.x -= 5;
    if (input.isKeyPressed('ArrowUp')) player.y -= 5;
    if (input.isKeyPressed('ArrowDown')) player.y += 5;
};

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.render(ctx);
};

const gameLoop = new GameLoop(update, render);
gameLoop.start();
