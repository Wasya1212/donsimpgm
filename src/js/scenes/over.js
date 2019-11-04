export default class Over extends Phaser.Scene {
  constructor () {
    super({
      key: 'game over'
    });

    this.totalScore = 1;
    this.resultsText = null;
    this.background = null;
    this.gameOverText = null;
  }

  init(score) {
    this.totalScore = score;
  }

  create() {
    this.background = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.6);
    this.gameOverText = this.add.text(this.game.renderer.width / 2 - 400, 200, { 'fontFamily': 'serif' });
    this.resultsText = this.add.text(this.game.renderer.width / 2 - 180, this.game.renderer.height * 0.6, { 'fontFamily': 'serif' });

    this.resultsText
      .setText(`Score: ${this.totalScore}`)
      .setColor('#3b2818')
      .setFontSize(50)
      .setFontStyle('bolder');

    this.gameOverText
      .setText("Game Over")
      .setColor('#25201d')
      .setFontSize(150)
      .setFontStyle('bolder');

    // show main menu
    this.input.on('pointerdown', () => this.scene.start('menu'));
  }
}
