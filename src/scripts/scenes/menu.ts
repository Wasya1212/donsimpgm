const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'menu'
};

export default class Menu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Image;
  menuBackground: Phaser.GameObjects.Image;
  hoverSprite: Phaser.GameObjects.Image;
  backgroundSound: Phaser.Sound.BaseSound;

  constructor () {
    super(sceneConfig);
  }

  preload() {
    this.backgroundSound = this.sound.add('menu-theme', { loop: true });
    //@ts-ignore
    this.backgroundSound.pauseOnBlur = false;
    //@ts-ignore
    this.backgroundSound.setVolume(0.4);
  }

  create() {
    this.playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.8, 'play-button').setDepth(1).setScale(0.6);
    this.menuBackground = this.add.image(0, 0, 'menu-background').setOrigin(0).setScale(1.6);

    this.hoverSprite = this.add.image(this.playButton.x - this.playButton.width * this.playButton.scaleX + 100, this.playButton.y, 'menu-pers').setVisible(false);

    this.playButton.setInteractive();
    this.playButton.on('pointerover', () => { this.hoverSprite.setVisible(true); });
    this.playButton.on('pointerout', () => { this.hoverSprite.setVisible(false); });
    this.playButton.on('pointerdown', () => {
      this.backgroundSound.stop();
      this.scene.start('game');
    });

    this.backgroundSound.play();
  }
}
