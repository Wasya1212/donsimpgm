const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'container',
  width: 800,
  height: 600,
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
        }
    }
});

let bullets;
let enemies;
let field;
// let homer;
let donut;

function preload() {
  this.load.spritesheet('subzero', 'assets/sprite.png', { frameWidth: 45, frameHeight: 120 });
  this.load.spritesheet('homer', 'assets/homer.png', { frameWidth: 22, frameHeight: 40 });
  this.load.spritesheet('donut', 'assets/donut.png', { frameWidth: 100, frameHeight: 100 });
  this.load.image('background', 'assets/Simpsons_22_15_P1_640x360_279961667900.jpg');
  this.load.image('bullet', 'assets/gem-06.png');
}

function create() {
  field = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1.5, 1.7);

  const subzeroAnimation = this.anims.create({
    key: 'subzero-stay',
    frames: this.anims.generateFrameNumbers('subzero', { end: 9 }),
    frameRate: 10,
    repeat: -1,
    yoyo: true
  });

  const homerStayAnimation = this.anims.create({
    key: 'homer-stay',
    frames: this.anims.generateFrameNumbers('homer', { end: 3 }),
    frameRate: 5,
    repeat: -1,
    yoyo: true
  });

  const homerGoAnimation = this.anims.create({
    key: 'homer-go',
    frames: this.anims.generateFrameNumbers('homer', { start: 16, end: 19 }),
    frameRate: 5,
    repeat: -1,
    yoyo: true
  });

  const donutMoveAnimation = this.anims.create({
    key: 'donut-move',
    frames: this.anims.generateFrameNumbers('donut', { end: 4 }),
    frameRate: 7,
    repeat: -1,
    yoyo: true
  });

  // const sprite = this.add.sprite(120, 240, 'subzero').setScale(4);
  // homer = this.physics.add.sprite(120, 240, 'homer').setScale(4);
  // donut = this.add.sprite(420, 240, 'donut').setScale(0.7);
  donut = this.physics.add.sprite(420, 240, 'donut').setScale(0.7);

  // homer.setCollideWorldBounds(true);

  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 5
  });
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(5, 'bullet');

  enemies = this.physics.add.group({
    maxSize: 150
  });

  // enemies.setCollideWorldBounds(true);

  setInterval(() => {
    enemies.create(100, 100, 'homer');

    let enemy = enemies.getChildren();
    enemy = enemy[enemy.length - 1];
    enemy.setCollideWorldBounds(true);
    enemy.setScale(4);
    enemy.play('homer-go');
    enemy.body.allowGravity = false;
    enemy.body.setVelocity(200, 0);
    enemy.body.onWorldBounds = true;
    enemy.body.setBounce(1, 0);

    setInterval(() => {
      enemy.y += 5;
    }, 100);

    this.physics.add.overlap(donut, enemy, () => {
      enemy.destroy();
    });
  }, 2000);

  // homer.play('homer-stay');
  donut.play('donut-move');

  // bullets.setTypeA().setCheckAgainstB().setActiveCollision().setMaxVelocity(300);
  // donut.setTypeB().setCheckAgainstA().setFixedCollision();

  // bullets.setVelocityX(300);

  // bullets.setCollideCallback(() => { alert(); }, this);
  donut.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
  // this.physics.add.overlap(donut, homer, () => {
  //   homer.destroy();
  // });
}

function update() {
  //  Run collision
  // enemies.setCollideCallback(() => { alert(); }, this);
  // this.physics.world.collide(homer, [ donut ]);

}
