// import { Enemy } from "../prefabs/enemy";
// import { Hero } from "../prefabs/hero";

import Player from "../prefabs/player";
import Enemy from "../prefabs/enemy";

export default class Play extends Phaser.Scene {
  staticBg: Phaser.GameObjects.Image;
  powerText: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  levelText: Phaser.GameObjects.Text;
  score: number = 0;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  timedEvent: Phaser.Time.TimerEvent;
  enemiesDifficult: number = 1;
  maxDefeatForDifficultIncrease: number = 5;
  backgroundSound: Phaser.Sound.BaseSound;

  player: Player;
  enemies: Enemy[] = [];

  shootDistance: number = 0;

  constructor () {
    super({ key: 'game' });
  }

  private createMultipleEnemies(key: string, enemiesCount: number, collisionDamage: number, callback?: (enemy: Enemy) => void): Enemy[] {
    let enemies: Enemy[] = [];

    for (let i = 0; i < enemiesCount; i++) {
      enemies.push(new Enemy({
        scene: this,
        x: 0, y: 0,
        key: key,
        physics: true,
        health: 1,
        collisionDamage: collisionDamage
      }));
    }

    if (callback) {
      try {
        enemies.forEach(enemy => { callback(enemy); })
      } catch(err) {
        console.error(err);
      }
    }

    return enemies;
  }

  private addOverlapFromBullets(player: Player, enemy: Enemy, onOverlap: (bullet: Phaser.GameObjects.Image, enemy: Phaser.GameObjects.Sprite) => void) {
    this.physics.add.overlap(player.weapon.bullets, enemy, onOverlap);
  }

  protected createHomerEnemy(enemiesCount: number): Enemy[] {
    let homerEnemies = this.createMultipleEnemies("homer", enemiesCount, 1, (homerEnemy: Enemy) => {
      // set animations
      homerEnemy.addAnimation("homer-go", 5, 16, 19);
      homerEnemy.addAnimation("homer-stay", 5, 0, 3);

      //@ts-ignore
      homerEnemy.body.allowGravity = false;
      homerEnemy.setGravity(0, 0);
      homerEnemy.setCollideWorldBounds(true);
      homerEnemy.setBounce(1, 0);
      homerEnemy.setScale(3);

      // movement settings
      homerEnemy.setVelocity(Phaser.Math.Between(50, 100) * (this.enemiesDifficult || 1) / 2, 5 * (this.enemiesDifficult || 1));
    });

    return homerEnemies;
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = new Player({ scene: this, x: 110, y: 110, key: "donut", physics: true, health: 1 });

    this.player.addAnimation("donut-move", 7, 0, 4);
    this.player.addAnimation("donut-fight", 5, 5, 7);
    this.player.addAnimation("donut-shoot", 5, 7, 7);

    this.player.setMaxVelocity(500);
    this.player.setFriction(1000, 100);
    this.player.setBounceX(0);
    this.player.setBounceY(0);

    this.player.weapon.setBulletSpeed(0.35);

    this.player.setControl(this.cursors.left, "keydown", () => {
      if (this.player.checkEventState("player move left") == false) {
        this.player.setEvent("player move", true);
        this.player.setEvent("player move left", true);
        this.player.setAccelerationX(-1200);
      }
      if (this.player.checkEventState("player move") == true) {
        this.player.weapon.setPosition(this.player.x, this.player.y);
      }
    });

    this.player.setControl(this.cursors.left, "keyup", () => {
      if (this.player.checkEventState("player move left")) {
        this.player.absorbEvent("player move");
        this.player.absorbEvent("player move left");
        this.player.setAccelerationX(0);
        this.player.body.velocity.x = 0;
        if (this.player.checkEventState("player move right") == true) {
          this.player.setAccelerationX(1200);
        }
      }
    });

    this.player.setControl(this.cursors.right, "keydown", () => {
      if (this.player.checkEventState("player move right") == false) {
        this.player.setEvent("player move", true);
        this.player.setEvent("player move right", true);
        this.player.setAccelerationX(1200);
      }
      if (this.player.checkEventState("player move") == true) {
        this.player.weapon.setPosition(this.player.x, this.player.y);
      }
    });

    this.player.setControl(this.cursors.right, "keyup", () => {
      if (this.player.checkEventState("player move right")) {
        this.player.absorbEvent("player move");
        this.player.absorbEvent("player move right");
        this.player.setAccelerationX(0);
        this.player.body.velocity.x = 0;
        if (this.player.checkEventState("player move left") == true) {
          this.player.setAccelerationX(-1200);
        }
      }
    });

    this.player.setControl(this.cursors.space, "keydown", () => {
      this.player.setEvent("ready to shoot", true);
      this.player.useAnimation("donut-shoot");
    });

    this.player.setControl(this.cursors.space, "keyup", () => {
      this.player.absorbEvent("ready to shoot");

      if (this.shootDistance < this.game.renderer.height / 3) {
        this.player.weapon.setBulletSpeed(0.7);
      } else {
        this.player.weapon.setBulletSpeed(0.35);
      }

      this.player.shoot({ x: this.player.x, y: this.player.y }, { y: this.game.renderer.height - this.shootDistance });
      this.player.useAnimation("donut-fight");
      this.shootDistance = 0;
    });

    this.player.turnOnControl();
  }

  create() {
    this.player.setTo(400, 250, 'donut-move');

    // main sound number
    let soundNumber = Phaser.Math.Between(1, 5);

    this.backgroundSound = this.sound.add(`main-audio-${soundNumber}`, { loop: true });
    //@ts-ignore
    this.backgroundSound.pauseOnBlur = false;
    this.backgroundSound.play();
    //@ts-ignore
    this.backgroundSound.setVolume(0.05);

    // add new enemies every 3 sec
    this.timedEvent = this.time.addEvent({
      delay: 1500,
      callback: () => {
        let enemies = this.createHomerEnemy(1);

        enemies[0].setTo(Phaser.Math.Between(100, this.game.renderer.width - 100), 100, "homer-go");

        this.time.addEvent({
          delay: 100,
          callback: () => {
            enemies[0].setScale(3 * (1 + enemies[0].y / 1000));
          },
          callbackScope: this,
          loop: true
        });
        enemies[0].play("homer-go");

        this.addOverlapFromBullets(this.player, enemies[0], (enemy, bullet) => {
          if (!bullet.active) {
            this.score++;
            enemy.destroy();
            bullet.active = true;
            bullet.setPosition(this.player.x, this.player.y);
            bullet.setVisible(false);
            setTimeout(() => { // we can kill only 1 enemy
              bullet.active = false;
            }, 500);
          }
        });

        this.physics.add.overlap(this.player, enemies[0], () => {
          this.backgroundSound.stop();
          this.scene.stop('game');
          this.scene.start('game over', { score: this.score || '0' });
        });

        this.enemies.push(...enemies);
      },
      callbackScope: this,
      loop: true
    });

    // show interface
    this.scene.launch('play');
    this.staticBg = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.6);

    this.powerText = this.add.text(10, 70, `Power: ${this.shootDistance}`);
    this.scoreText = this.add.text(this.game.renderer.width - 150, 70, `Score: ${this.score}`);
    this.levelText = this.add.text(this.game.renderer.width / 2 - 60, 70, `Level: ${this.enemiesDifficult}`);
  }

  update () {
    if (this.player.checkEventState("ready to shoot") == true) {
      this.shootDistance += 10;
    }

    // update info
    this.powerText.setText('Power: ' + this.shootDistance);
    this.scoreText.setText('Score: ' + this.score);
    this.levelText.setText('Level: ' + this.enemiesDifficult);

    // diffictly levels changing
    // more kill hire diffictly
    if (this.score >= this.maxDefeatForDifficultIncrease) {
      this.maxDefeatForDifficultIncrease += 5 * this.enemiesDifficult;
      this.enemiesDifficult += 1;
    }
  }
}
