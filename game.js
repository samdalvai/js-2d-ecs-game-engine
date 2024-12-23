import GameLoop from './engine/loop.js';
import InputManager from './engine/input.ts';
import Entity from './engine/entity.ts';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const input = new InputManager();
const player = new Entity(100, 100);

const update = (dt) => {
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
