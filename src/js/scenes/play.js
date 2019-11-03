import { Enemy } from "../prefabs/enemy";

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
    this.enemies = [];
  }

  init() {
    console.log('play init');

    let homerEnemy = new Enemy({ scene: this, x: 0, y: 0, key: 'homer' });

    homerEnemy.addAnimation('homer-go', 5, 16, 19);
    homerEnemy.addMovement('homer-go', homer => {
      homer.body.setBounce(1, 0);
      homer.body.setVelocity(200, 0);

      setInterval(() => {
        homer.y += 1;
      }, 100);
    });

    homerEnemy.createAndSetTo(100, 100, 'homer-go');

    this.enemies.push(homerEnemy);
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
    console.log("play");
    this.scene.launch();
    this.staticBg = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.6);
    this.text = this.add.text(10, 70);
    this.text.setText('Power: ' + 100);

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
  }

  update() {
    console.log('hello world');
    this.text.setText('Power: ' + 100);
  }
}
