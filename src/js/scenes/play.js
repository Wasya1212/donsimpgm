import { Enemy } from "../prefabs/enemy";
import { Hero } from "../prefabs/hero";

export default class Play extends Phaser.Scene {
  constructor () {
    super({
      key: 'game'
    });

    this.staticBg = null;
    this.scrollingBg = null;
    this.text = null;
    this.progressBar;
    this.progressBox;
    this.enemies = {};
    this.hero;
    this.cursors;
  }

  init() {
    console.log('play init');

    let homerEnemy = new Enemy({ scene: this, x: 0, y: 0, key: 'homer' });

    homerEnemy.addAnimation('homer-go', 5, 16, 19);
    homerEnemy.addAnimation('homer-stay', 5, 0, 3);

    homerEnemy.createAndSetTo(100, 100, 4, 'homer-go');

    this.enemies.homer = homerEnemy;

    this.hero = new Hero({ scene: this, x: 0, y: 0, key: 'donut' });
    this.hero.addAnimation('donut-move', 7, 0, 4);
    this.hero.addAnimation('donut-fight', 5, 5, 7);
    this.hero.addAnimation('donut-shoot', 5, 7, 7);

    for (let i = 0; i < 5; i++) {
      this.hero.addBullet(`bullet-type-${i+1}`);
    }
  }

  preload() {
    // this.progressBar = this.add.graphics();
    // this.progressBox = this.add.graphics();
    // this.progressBox.fillStyle(0x222222, 0.8);
    // this.progressBox.fillRect(240, 270, 320, 50);

    console.log('preload play')
    this.load.image('background', 'img/Simpsons_22_15_P1_640x360_279961667900.jpg');



    // this.load.on('progress', value => {
    //     console.log(value);
    //     this.progressBar.clear();
    //     this.progressBar.fillStyle(0xffffff, 1);
    //     this.progressBar.fillRect(250, 280, 300 * value, 30);
    // });
    //
    // this.load.on('fileprogress', function (file) {
    //     console.log(file.src);
    // });
    //
    // this.load.on('complete', function () {
    //     console.log('complete');
    // });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.hero.createAndSetTo();
    this.hero.useAnimation('donut-move');

    console.log("play");
    this.scene.launch();
    this.staticBg = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.6);
    this.text = this.add.text(10, 70);
    this.text.setText('Power: ' + 100);

    setTimeout(() => {
      this.enemies.homer.each(enemy => {
        enemy.play('homer-stay');
      });
    }, 5000);

    // setInterval(() => {
    //   enemies.create(100, 100, 'homer');
    //
    //   let enemy = enemies.getChildren();
    //   enemy = enemy[enemy.length - 1];
    //   enemy.setCollideWorldBounds(true);
    //   enemy.setScale(4);
    //   enemy.play('homer-go');
    //   enemy.body.allowGravity = false;
    //   enemy.body.setVelocity(200, 0);
    //   enemy.body.onWorldBounds = true;
    //   enemy.body.setBounce(1, 0);
    //
    //   setInterval(() => {
    //     enemy.y += 1;
    //   }, 100);
    // }, 1000);

    this.physics.add.overlap(this.hero.bullets, this.enemies.homer.enemiesGroup, (bullet, enemy) => {
      if (!bullet.active) {
        enemy.destroy();
        bullet.active = true;
        bullet.setPosition(this.hero.getPosition().x, this.hero.getPosition().y).setVisible(false);
        setTimeout(() => { // we can kill only 1 enemy
          bullet.active = false;
        }, 500);
      }
    });
  }

  update() {
    console.log('hello world');
    this.text.setText('Power: ' + 100);


    if (this.cursors.left.isDown) {
      this.hero.character.setAccelerationX(-1200);
    } else if (this.cursors.right.isDown) {
      this.hero.character.setAccelerationX(1200);
    } else {
      this.hero.character.setAccelerationX(0);
      this.hero.character.body.velocity.x = 0;
    }

    if (this.cursors.space.isDown) {
      this.hero.increaseShootPower(10);
    }

    if (this.hero.shootPower > 0 && this.hero.character.anims.getCurrentKey() != 'donut-shoot') {
      this.hero.useAnimation('donut-shoot');
    }

    if (this.cursors.space.isUp && this.hero.shootPower > 0) {
      this.hero.useAnimation('donut-fight');
      this.hero.shoot();
    }
  }
}
