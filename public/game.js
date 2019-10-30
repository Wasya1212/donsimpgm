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
let cursors;
let b1;
let power = 0;
let text;

function preload() {
  this.load.spritesheet('subzero', 'assets/sprite.png', { frameWidth: 45, frameHeight: 120 });
  this.load.spritesheet('homer', 'assets/homer.png', { frameWidth: 22, frameHeight: 40 });
  this.load.spritesheet('donut', 'assets/donut.png', { frameWidth: 100, frameHeight: 100 });
  this.load.image('background', 'assets/Simpsons_22_15_P1_640x360_279961667900.jpg');
  this.load.image('bullet-type-1', 'assets/gem-01.png');
  this.load.image('bullet-type-2', 'assets/gem-02.png');
  this.load.image('bullet-type-3', 'assets/gem-03.png');
  this.load.image('bullet-type-4', 'assets/gem-04.png');
  this.load.image('bullet-type-5', 'assets/gem-05.png');
  this.load.image('bullet-type-6', 'assets/gem-07.png');
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

  const donutFightAnimation = this.anims.create({
    key: 'donut-fight',
    frames: this.anims.generateFrameNumbers('donut', { start: 5, end: 6 }),
    frameRate: 5,
    repeat: -1,
    yoyo: true
  });

  const donutShootAnimation = this.anims.create({
    key: 'donut-shoot',
    frames: this.anims.generateFrameNumbers('donut', { start: 7, end: 7 }),
    frameRate: 5,
    repeat: -1,
    yoyo: true
  });

  // const sprite = this.add.sprite(120, 240, 'subzero').setScale(4);
  // homer = this.physics.add.sprite(120, 240, 'homer').setScale(4);
  // donut = this.add.sprite(420, 240, 'donut').setScale(0.7);
  donut = this.physics.add.sprite(420, 240, 'donut').setScale(1);
  // donut.body.allowGravity = false;
  donut.setCollideWorldBounds(true);
  donut.setMaxVelocity(500);
  donut.setFriction(1000, 100);

  // homer.setCollideWorldBounds(true);

  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 5
  });
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(5, 'bullet');


  for (let i = 0; i < 5; i++) {
    bullets.create(donut.x, 600, `bullet-type-${i+1}`, null, false);
  }

  bullets.getChildren().forEach(bullet => {
    bullet.body.allowGravity = false;
    bullet.setScale(0.5)
  });


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
      enemy.y += 1;
    }, 100);
  }, 1000);

  this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
    if (!bullet.active) {
      enemy.destroy();
      bullet.active = true;
      bullet.setPosition(donut.x, donut.y).setVisible(false);
      setTimeout(() => { // we can kill only 1 enemy
        bullet.active = false;
      }, 500);
    }
  });

  // homer.play('homer-stay');
  donut.play('donut-fight');

  // bullets.setTypeA().setCheckAgainstB().setActiveCollision().setMaxVelocity(300);
  // donut.setTypeB().setCheckAgainstA().setFixedCollision();

  // bullets.setVelocityX(300);

  // bullets.setCollideCallback(() => { alert(); }, this);
  // donut.body.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true);
  // this.physics.add.overlap(donut, homer, () => {
  //   homer.destroy();
  // });
  cursors = this.input.keyboard.createCursorKeys();

  text = this.add.text(10, 70);

}

function update() {
  //  Run collision
  // enemies.setCollideCallback(() => { alert(); }, this);
  // this.physics.world.collide(homer, [ donut ]);
  text.setText('Power: ' + power);
  if (cursors.left.isDown) {
    donut.setAccelerationX(-1200);
  } else if (cursors.right.isDown) {
    donut.setAccelerationX(1200);
  } else {
    donut.setAccelerationX(0);
    donut.body.velocity.x = 0;
  }

  if (cursors.space.isDown) {
    power += 10;
  }

  if (power > 0 && donut.anims.getCurrentKey() != 'donut-shoot') {
    donut.play('donut-shoot');
  }

  if (cursors.space.isUp && power > 0) {
    donut.play('donut-fight');

    let activeBullet = bullets.getFirstAlive();

    if (!activeBullet) {
      return;
    }

    activeBullet.x = donut.x;
    activeBullet.y = donut.y;
    activeBullet.active = false;
    activeBullet.visible = true;

    // activeBullet.x = donut.x
    this.tweens.add({
      targets: activeBullet,//[Phaser.Math.Between(1, 5)],
      props: {
        y: { value: 600 - power, duration: 350},
      },
      ease: 'Sine.easeInOut',
      onComplete: () => {
        setTimeout(() => {
          activeBullet.active = true;
        }, 3000);
        activeBullet.setVisible(false).setPosition(donut.x, donut.y);
      }
    });
    power = 0;
  }

}
