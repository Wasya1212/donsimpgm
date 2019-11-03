export class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);

    this.mainName = config.key;
    this.animations = Object.create(null);
    this.movements = Object.create(null);
    this.enemiesGroup = this.scene.physics.add.group({
      maxSize: 150
    });
  }

  addAnimation(key, frameRate, startFrame, endFrame) {
    this.animations[key.toString()] = this.scene.anims.create({
      key: key,
      frames: this.scene.anims.generateFrameNumbers(this.mainName, { start: startFrame, end: endFrame }),
      frameRate: frameRate,
      repeat: -1,
      yoyo: true
    });
  }

  addMovement(animationKey, callback, config) {
    this.movements[animationKey.toString()].use = enemy => {
      callback(enemy);
      enemy.play(animationKey);
    };
  }

  useMovement(enemyId, movementKey) {
    let enemies = this.enemiesGroup.getChildren();

    try {
      let enemy = enemies[enemies.findIndex(enemy => enemy.id == enemyId)];

      this.movements.use(enemy);
    } catch (e) {
      console.error(e);
    }

    this.enemiesGroup.getChildren()[enemyIndex]
  }

  createAndSetTo(x, y, scale, animationName) {
    this.enemiesGroup.create(x, y, this.mainName);

    let enemy = this.enemiesGroup.getChildren();
    const enemyIndex = enemy.length - 1;

    enemy = enemy[enemyIndex];
    enemy.setCollideWorldBounds(true);
    enemy.body.allowGravity = false;
    enemy.body.onWorldBounds = true;
    enemy.setScale(scale).setDepth(1);
    enemy.id = `${this.mainName}-enemy-${enemyIndex}`;

    enemy.play(animationName);

    return { enemy, index: enemyIndex };
  }

  createNew() {

  }

  each(callback) {
    this.enemiesGroup.getChildren().forEach(callback);
  }
}
