export default class Over extends Phaser.Scene {
  totalScore: number = 1;
  resultsText: Phaser.GameObjects.Text;
  gameOverText: Phaser.GameObjects.Text;
  background: Phaser.GameObjects.Image;

  constructor () {
    super({ key: 'game over' });
  }

  init(results?: { score: number }) {
    this.totalScore = results.score;
  }

  create() {
    this.background = this.add.image(0, 0, 'background').setOrigin(0).setScale(1.6);
    //@ts-ignore
    this.gameOverText = this.add.text(this.game.renderer.width / 2 - 400, 200, { fontFamily: "serif" });
    //@ts-ignore
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
