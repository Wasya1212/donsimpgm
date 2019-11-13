import Game from "./js/game";
import { Preload, Play, Menu, Over } from './js/scenes';

const playScene = new Play();

const config = {
  title: "Donuts",
  width: 1000,
  height: 800,
  parent: "game",
  pixelArt: true,
  scene: [
    Preload,
    Menu,
    Play,
    Over
  ],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 300 }
    }
  }
};

let game;

window.onload = () => {
  game = new Game(config);
};
