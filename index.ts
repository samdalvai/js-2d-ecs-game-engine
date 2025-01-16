/*import Game from './src/game/Game';

const game = new Game();

game.initialize();
game.run();
game.destroy();*/

const image = new Image();
image.src = './assets/chopper.png';

console.log('image: ', image);

const app = document.getElementById('app');
if (app) {
    app.innerHTML = `<h1>Hello, TypeScriptssss!</h1>`;
    app.appendChild(image);
}
