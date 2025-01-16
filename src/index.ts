import Game from './game/Game';

const game = new Game();

game.initialize();
game.run();
game.destroy();

// const image = new Image();
// image.src = './assets/chopper.png';

// image.onload = () => {
//     console.log('Image loaded: ', image.src);
// };

// image.onerror = () => {
//     console.error('Failed to load the image: ', image.src);
// };

// console.log('image: ', image);

// const sound = new Audio();
// sound.src = './assets/helicopter.wav';

// function onPlay() {
//     sound.play();
// }

// const app = document.getElementById('app');
// if (app) {
//     app.innerHTML = '<h1>Hello, TypeScriptssss Hello!</h1>';
//     app.appendChild(image);

//     const button = document.createElement('button');
//     button.innerHTML = 'Click Me!';

//     // Add the onclick event listener to the button
//     button.onclick = onPlay;

//     // Append the button to the app
//     app.appendChild(button);
// }
