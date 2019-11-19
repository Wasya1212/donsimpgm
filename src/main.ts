import { Game } from "./scripts/game";
import { Preload } from './scripts/scenes/index';
// import { Preload, Play, Menu, Over } from './scripts/scenes/index';
import * as Phaser from "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  title: "Donuts",

  width: 1000,
  height: 800,

  parent: "game",

  // pixelArt: true,

  scene: [
    Preload,
    // Menu,
    // Play,
    // Over
  ],

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 300 }
    }
  }
};

window.onload = () => {
  let game: Phaser.Game = new Game(config);
};
