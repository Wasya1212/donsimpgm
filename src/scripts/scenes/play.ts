import { Enemy } from "../prefabs/enemy";
import { Hero } from "../prefabs/hero";

export default class Play extends Phaser.Scene {
  staticBg: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  levelText: Phaser.GameObjects.Text;
  score: number = 0;
  enemies: any = {};
  hero: Hero;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  timedEvent: Phaser.Time.TimerEvent;
  enemiesDifficult: number = 1;
  maxDefeatForDifficultIncrease: number = 5;
  backgroundSound: Phaser.Sound.BaseSound;

  constructor () {
    super({
      key: 'game'
    });
  }

  init() {
    this.score = 0;
    this.enemiesDifficult = 1;
    this.maxDefeatForDifficultIncrease = 5;

    this.enemies.homer = new Enemy(this, 0, 0, 'homer');

    // add enemy animations
    this.enemies.homer.addAnimation('homer-go', 5, 16, 19);
    this.enemies.homer.addAnimation('homer-stay', 5, 0, 3);

    // create main character
    this.hero = new Hero(this, 0, 0, 'donut');
    // add main character animations
    this.hero.addAnimation('donut-move', 7, 0, 4);
    this.hero.addAnimation('donut-fight', 5, 5, 7);
    this.hero.addAnimation('donut-shoot', 5, 7, 7);

    for (let i = 0; i < 5; i++) {
      this.hero.addBullet(`bullet-type-${i+1}`);
    }
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // main sound number
    let soundNumber = Phaser.Math.Between(1, 5);

    this.backgroundSound = this.sound.add(`main-audio-${soundNumber}`, { loop: true })
    // this.backgroundSound.pauseOnBlur = false;
    this.backgroundSound.play();
    // this.backgroundSound.setVolume(0.4);

    // show main character
    this.hero.createAndSetTo();
    this.hero.useAnimation('donut-move');

    // add new enemies every 3 sec
    this.timedEvent = this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.enemies.homer.createAndSetTo(Phaser.Math.Between(100, this.game.renderer.width - 100), 100, 4, 'homer-go', this.enemiesDifficult);
      },
      callbackScope: this,
      loop: true
    });

    // show interface
    this.scene.launch('play');
    this.staticBg = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.6);

    this.text = this.add.text(10, 70, `Power: ${this.hero.shootPower}`);
    // this.text.setText('Power: ' + this.hero.shootPower);

    this.scoreText = this.add.text(this.game.renderer.width - 150, 70, `Score: ${this.score}`);
    // this.scoreText.setText('Score: ' + this.score);

    this.levelText = this.add.text(this.game.renderer.width / 2 - 60, 70, `Level: ${this.enemiesDifficult}`);
    // this.levelText.setText('Level: ' + this.enemiesDifficult);

    // bullets & enemy collision
    // kill enemy
    this.physics.add.overlap(this.hero.bullets, this.enemies.homer.enemiesGroup, (bullet: Phaser.GameObjects.Image, enemy: Phaser.GameObjects.Sprite) => {
      if (!bullet.active) {
        this.score++;
        enemy.destroy();
        bullet.active = true;
        bullet.setPosition(this.hero.getPosition().x, this.hero.getPosition().y).setVisible(false);
        setTimeout(() => { // we can kill only 1 enemy
          bullet.active = false;
        }, 500);
      }
    });

    // character & enemy collision
    // end game
    this.physics.add.overlap(this.hero.character, this.enemies.homer.enemiesGroup, () => {
      this.backgroundSound.stop();
      this.scene.stop('game');
      this.scene.start('game over', { score: this.score || '0' });
    });
  }

  update() {
    // update info
    this.text.setText('Power: ' + this.hero.shootPower);
    this.scoreText.setText('Score: ' + this.score);
    this.levelText.setText('Level: ' + this.enemiesDifficult);

    // diffictly levels changing
    // more kill hire diffictly
    if (this.score >= this.maxDefeatForDifficultIncrease) {
      this.maxDefeatForDifficultIncrease += 5 * this.enemiesDifficult;
      this.enemiesDifficult++;

      if (this.timedEvent.delay > 1000) {
        // this.timedEvent.delay -= 500; wery important to use! dont forget
        this.timedEvent.reset({ delay: this.timedEvent.delay - 500 });
      }
    }

    // move main character
    if (this.cursors.left.isDown) {
      this.hero.character.setAccelerationX(-1200);
    } else if (this.cursors.right.isDown) {
      this.hero.character.setAccelerationX(1200);
    } else {
      this.hero.character.setAccelerationX(0);
      this.hero.character.body.velocity.x = 0;
    }

    // increase shoot power
    if (this.cursors.space.isDown) {
      this.hero.increaseShootPower(10);
    }

    // show shoot animation
    if (this.hero.shootPower > 0 && this.hero.character.anims.getCurrentKey() != 'donut-shoot') {
      this.hero.useAnimation('donut-shoot');
    }

    // shoot
    if (this.cursors.space.isUp && this.hero.shootPower > 0) {
      this.hero.useAnimation('donut-fight');
      this.hero.shoot();
    }
  }
}
