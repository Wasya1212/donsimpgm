import { CST } from "../CST";

export default class Preload extends Phaser.Scene {
  progressBar: Phaser.GameObjects.Graphics;
  progressBox: Phaser.GameObjects.Graphics;

  loadingText: Phaser.GameObjects.Text;
  percentText: Phaser.GameObjects.Text;
  assetText: Phaser.GameObjects.Text;

  constructor () {
    super({ key: 'preload' });
  }

  loadImages() {
    this.load.setPath("img");

    for (let prop in CST.IMAGE) {
      this.load.image(<string>prop, CST.IMAGE[prop].toString());
    }
  }

  loadSprites(framesConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig) {
    this.load.setPath("img");

    for (let prop in CST.SPRITE) {
      this.load.spritesheet(<string>prop, CST.SPRITE[prop].toString(), framesConfig);
    }
  }

  loadAudios() {
    this.load.setPath("audio");

    for (let prop in CST.AUDIO) {
      this.load.audio(<string>prop, CST.AUDIO[prop].toString());
    }
  }

  init() {
    // show progress bar
    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(240, 270, 520, 50);
    // show progress text
    this.loadingText = this.make.text({
        x: this.game.renderer.width / 2,
        y: this.game.renderer.height / 2 - 150,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    this.loadingText.setOrigin(0.5, 0.5);

    this.percentText = this.make.text({
        x: this.game.renderer.width / 2,
        y: this.game.renderer.height / 2 - 100,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    this.percentText.setOrigin(0.5, 0.5);

    this.assetText = this.make.text({
        x: this.game.renderer.width / 2 - 250,
        y: this.game.renderer.height / 2 - 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
  }

  preload() {
    this.loadAudios();
    this.loadImages();
    this.loadSprites();

    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(250, 280, 500 * value, 30);
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.assetText.setText('Loading asset: ' + file.key);
      this.percentText.setText(`${Math.round(file.percentComplete * 100)}%`);
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
      this.assetText.destroy();
    });
  }

  create() {
    this.input.setDefaultCursor(`url(img/${CST.CURSOR.POINTER}), pointer`);
  }
}
