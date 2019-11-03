export class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);

    this.mainName = config.key;
    this.animations = Object.create(null);
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

  useAnimation(enemyId, animationName) {
    let enemies = this.enemiesGroup.getChildren();

    try {
      let enemy = enemies[enemies.findIndex(enemy => enemy.id == enemyId)];

      enemy.play(animationName);
    } catch (e) {
      console.error(e);
    }
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
    enemy.body.setBounce(1, 0);
    enemy.body.setVelocity(200, 0);

    setInterval(() => {
      enemy.y += 1;
    }, 100);

    enemy.play(animationName);

    return { enemy, index: enemyIndex };
  }

  each(callback) {
    this.enemiesGroup.getChildren().forEach(callback);
  }
}
