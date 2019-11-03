export default class Menu extends Phaser.Scene {
  constructor () {
    super({
      key: 'menu'
    });

    this.playButton;
    this.hoverSprite;
    this.menuBackground;
  }

  preload() {
    this.load.image('play-button', 'img/play-text.png');
    // this.loading.audio();
  }

  create() {
    console.log("create");

    this.playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.8, 'play-button').setDepth(1).setScale(0.6);
    this.menuBackground = this.add.image(0, 0, 'menu-background').setOrigin(0).setScale(1.6);

    this.hoverSprite = this.add.image(this.playButton.x - this.playButton.width * this.playButton.scaleX + 100, this.playButton.y, 'menu-pers').setVisible(false);

    this.playButton.setInteractive();
    this.playButton.on('pointerover', () => { this.hoverSprite.setVisible(true); });
    this.playButton.on('pointerout', () => { this.hoverSprite.setVisible(false); });
    this.playButton.on('pointerdown', () => { this.scene.start('game'); });

    this.sound.pauseOnBlur = false;
    // this.sound.play('theme', { loop: true });
  }

  update() {

  }
}
