export class Hero extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);

    this.mainName = config.key;
    this.animations = Object.create(null);
    this.character;
    this.shootPower = 0;
    this.bullets = this.scene.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 5
    });
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(5, 'bullet');
  }

  addBullet(bulletFrame) {
    let bullet = this.bullets.create(420, 600, bulletFrame, null, false);

    bullet.body.allowGravity = false;
    bullet.setScale(0.5).setDepth(1);
  }

  increaseShootPower(c) {
    this.shootPower += c;
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

  useAnimation(animationKey) {
    this.character.play(animationKey);
  }

  createAndSetTo(key) {
    this.character = this.scene.physics.add.sprite(420, 240, this.mainName).setScale(1);
    this.character.setCollideWorldBounds(true);
    this.character.setMaxVelocity(500);
    this.character.setFriction(1000, 100);
    this.character.setDepth(1);

    return this.character;
  }

  getPosition() {
    return {
      x: this.character.x,
      y: this.character.y
    }
  }

  shoot() {
    let activeBullet = this.bullets.getFirstAlive();

    if (!activeBullet) {
      return;
    }

    activeBullet.x = this.character.x;
    activeBullet.y = this.character.y;
    activeBullet.active = false;
    activeBullet.visible = true;

    // show bullet/shoot animation
    this.scene.tweens.add({
      targets: activeBullet,
      props: {
        y: { value: this.scene.game.renderer.height - this.shootPower, duration: 350},
      },
      ease: 'Sine.easeInOut',
      onComplete: () => {
        setTimeout(() => {
          activeBullet.active = true;
        }, 3000);
        activeBullet.setVisible(false).setPosition(this.character.x, this.character.y).setDepth(1);
      }
    });

    this.shootPower = 0;
  }
}
