import * as Phaser from "phaser";

class Unit extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
  }
};

export default Unit;
