export default class Preload extends Phaser.Scene {
  constructor () {
    super({
      key: 'preload'
    });

    this.logos = [];
    this.previewTimer = 6000;
    this.progressBar;
    this.progressBox;
    this.loadingText;
    this.percentText;
    this.assetText;
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
    this.load.on('progress', value => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(250, 280, 500 * value, 30);
    });

    this.load.on('fileprogress', file => {
      this.assetText.setText('Loading asset: ' + file.key);
      this.percentText.setText(parseInt(file.percentComplete * 100) + '%');
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
      this.assetText.destroy();
    });

    // load game assets
    this.load.spritesheet('homer', 'img/homer.png', { frameWidth: 22, frameHeight: 40 });
    this.load.spritesheet('donut', 'img/donut.png', { frameWidth: 100, frameHeight: 100 });
    this.load.image('bullet-type-1', 'img/gem-01.png');
    this.load.image('bullet-type-2', 'img/gem-02.png');
    this.load.image('bullet-type-3', 'img/gem-03.png');
    this.load.image('bullet-type-4', 'img/gem-04.png');
    this.load.image('bullet-type-5', 'img/gem-05.png');
    this.load.image('bullet-type-6', 'img/gem-07.png');
    this.load.image('background', 'img/Simpsons_22_15_P1_640x360_279961667900.jpg');
    this.load.audio('main-audio-1', 'audio/Gammer - Pigface (Dougal _& Gammer Edit).mp3');
    this.load.audio('main-audio-2', 'audio/Nintendo Sounds - Gregor Le DahL.mp3');
    this.load.audio('main-audio-3', 'audio/Archie - Back Again.mp3');
    this.load.audio('main-audio-4', 'audio/Chris Kilroy - Crank (Sean_&Bobo Remix).mp3');
    this.load.audio('main-audio-5', 'audio/what is love 8 bit.mp3');

    // load logos
    this.load.image('logo', 'img/Super_Huevo-logo-084A65108B-seeklogo.com.png');
    this.load.image('logo2', 'img/f548500ec178d92b2de654c19d46076b.png');

    // load menu assets
    this.load.image('menu-background', 'img/Simpsons_22_15_P1_640x360_2799616679002.jpg');
    this.load.image('menu-pers', 'img/gem-07.png');
    this.load.image('play-button', 'img/play-text.png');
    this.load.audio('menu-theme', 'audio/みっちりねこマーチ - MitchiriNeko March - Cute cat characters in a marching band!.mp3');

    // load game over assets
    this.load.image('over-background', 'img/background.jpg');
  }

  create() {
    this.input.setDefaultCursor('url(img/cursor.png), pointer');

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
