import "phaser";

export default class Boot extends Phaser.State {
  preload() {
      this.game.stage.backgroundColor = '#000';
      // this.load.image('loaderBg', 'img/Simpsons_22_15_P1_640x360_279961667900.png');
  }

  create() {
    console.log("boot");
    this.state.start('Preload');
  }
}
