import { CST } from "../CST";

export default class Preload extends Phaser.Scene {
  previewTimer: number = 6000;
  logos: Phaser.GameObjects.Image[] = [];

  constructor () {
    super({ key: 'boot' });
  }

  init() {
    this.input.setDefaultCursor(`url(img/${CST.CURSOR.POINTER}), pointer`);
  }

  create() {
    // create logos
    this.logos.push(this.add.image(0, 0, "logo").setOrigin(0).setScale(0.7).setTint(0).setVisible(false));
    this.logos.push(this.add.image(0, 0, "logo2").setOrigin(0).setScale(0.4).setTint(0).setVisible(false));

    // show all logos
    this.logos.forEach((logo, index) => {
      this.time.delayedCall(this.previewTimer * index, () => { this.showLogo(logo, this.previewTimer); }, [], this);
    });
    //
    // // start game after logos showing
    this.time.delayedCall(12000, () => { this.scene.start('menu', {}); }, [], this);

    // skip the screensaver
    this.input.on('pointerdown', () => this.scene.start('menu'));
  }

  showLogo(logo: Phaser.GameObjects.Image, duration: number) {
    // make logo visible
    logo.setVisible(true)
    logo.setPosition(this.cameras.main.centerX - (logo.width * logo.scaleX) / 2, this.cameras.main.centerY - (logo.height * logo.scaleY) / 2)

    // logo showing animation
    this.tweens.addCounter({
        from: 0,
        to: 255,
        duration: duration / 2,
        repeat: 0,
        yoyo: true,
        onUpdate: (tween: Phaser.Tweens.Tween) => {
          let value: number = Math.floor(tween.getValue());

          logo.setTint(Phaser.Display.Color.GetColor(value, value, value));
        }
    });
  }
}
