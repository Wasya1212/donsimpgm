import "phaser";
import Play from "./play.js";

export default class Preload extends Phaser.Scene {
  constructor () {
    super({
      key: 'preload'
    });

    this.logos = [];
    this.previewTimer = 6000;
  }

  preload() {
    console.log('preload preload')

    // load game assets
    this.load.spritesheet('homer', 'img/homer.png', { frameWidth: 22, frameHeight: 40 });
    this.load.spritesheet('donut', 'img/donut.png', { frameWidth: 100, frameHeight: 100 });
    this.load.image('bullet-type-1', 'img/gem-01.png');
    this.load.image('bullet-type-2', 'img/gem-02.png');
    this.load.image('bullet-type-3', 'img/gem-03.png');
    this.load.image('bullet-type-4', 'img/gem-04.png');
    this.load.image('bullet-type-5', 'img/gem-05.png');
    this.load.image('bullet-type-6', 'img/gem-07.png');

    // load logos
    this.load.image('logo', 'img/Super_Huevo-logo-084A65108B-seeklogo.com.png');
    this.load.image('logo2', 'img/f548500ec178d92b2de654c19d46076b.png');

    // load menu assets
    this.load.image('menu-background', 'img/Simpsons_22_15_P1_640x360_279961667900.jpg');
    this.load.image('menu-pers', 'img/gem-07.png');
    this.load.audio('theme', 'audio/background.mp3');
  }

  create() {
    this.input.setDefaultCursor('url(img/cursor.png), pointer').setScale(0.4)

    // create logos
    this.logos.push(this.add.image(0, 0, 'logo').setOrigin(0).setScale(0.7).setTint(0).setVisible(false));
    this.logos.push(this.add.image(0, 0, 'logo2').setOrigin(0).setScale(0.4).setTint(0).setVisible(false));

    // show all logos
    this.logos.forEach((logo, index) => {
      this.time.delayedCall(this.previewTimer * index, () => { this.showLogo(logo, this.previewTimer); }, [], this);
    });
    //
    // // start game after logos showing
    this.time.delayedCall(12000, () => { this.scene.start('menu', 'hello play game'); }, [], this);

    // skip the screensaver
    this.input.on('pointerdown', () => this.scene.start('menu'));
  }

  showLogo(logo, duration) {
    // make logo visible
    logo.setVisible(true)
    console.log(logo.width)
    logo.setPosition(this.cameras.main.centerX - (logo.width * logo.scaleX) / 2, this.cameras.main.centerY - (logo.height * logo.scaleY) / 2)

    // logo showing animation
    this.tweens.addCounter({
        from: 0,
        to: 255,
        duration: duration / 2,
        repeat: 0,
        yoyo: true,
        onUpdate: tween => {
          let value = Math.floor(tween.getValue());

          logo.setTint(Phaser.Display.Color.GetColor(value, value, value));
        }
    });
  }
}
