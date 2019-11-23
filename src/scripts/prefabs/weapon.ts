export interface WeaponConfig {
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  bulletKey?: string,
  bulletsCount?: number,
  bulletFrames?: string[],
  bulletDamage?: number,
  bulletSpeed?: number
}

export class Weapon extends Phaser.Physics.Arcade.Sprite {
  protected damage: number;
  protected config: WeaponConfig;

  constructor(config: WeaponConfig) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.add.existing(this);
    this.scene.physics.world.enable([ this ]);

    this.damage = config.bulletDamage || 1;
    this.config = config;
  }
}

export class MeleeWeapon extends Weapon {
  constructor(config: WeaponConfig) {
    super(config);
  }
}

export class RangeWeapon extends Weapon {
  public bullets: Phaser.Physics.Arcade.Group;
  private bulletSpeed: number;

  constructor(config: WeaponConfig) {
    super(config);

    this.setBulletSpeed(this.config.bulletSpeed);

    this.bullets = this.scene.physics.add.group({
      defaultKey: this.config.bulletKey,
      maxSize: this.config.bulletsCount
    });

    this.scene.physics.world.enable([ this.bullets ]);

    this.bullets.createMultiple({ quantity: this.config.bulletsCount, key: this.config.bulletKey });

    if (this.config.bulletFrames && this.config.bulletFrames.length > 0) {
      this.config.bulletFrames.forEach((frame: string) => {
        this.addBullet(frame);
      });
    } else {
      for (let i = 0; i < this.config.bulletsCount; i++) {
        this.addBullet(this.config.bulletKey);
      }
    }
  }

  private addBullet(bulletFrame: string) {
    let bullet: any = this.bullets.create(420, 600, bulletFrame, null, false);

    bullet.body.allowGravity = false;
    bullet.setScale(0.5).setDepth(1);
  }

  public setBulletSpeed(speed?: number) {
    this.bulletSpeed = (speed && speed >= 0.001 && speed <= 0.999)
      ? 1000 - Math.round(speed * 1000)
      : 100;
  }

  public shoot(startPosition: { x: number, y: number }, destination: { x?: number | null, y?: number | null }, callback?: (bullet: any) => void) {
    let activeBullet = this.bullets.getFirstAlive();

    if (!activeBullet) {
      return;
    }

    activeBullet.x = startPosition.x;
    activeBullet.y = startPosition.y;
    activeBullet.active = false;
    activeBullet.visible = true;

    let props;

    if (typeof destination.x !== null && typeof destination.y !== null) {
      props = {
        x: { value: destination.x, duration: this.bulletSpeed },
        y: { value: destination.y, duration: this.bulletSpeed }
      };
    } else if (typeof destination.x === null && destination.y) {
      props = {
        y: { value: destination.y, duration: this.bulletSpeed }
      };
    } else if (destination.x && typeof destination.y === null) {
      props = {
        x: { value: destination.x, duration: this.bulletSpeed }
      };
    } else {
      props = {};
    }

    // show bullet/shoot animation
    this.scene.tweens.add({
      targets: activeBullet,
      props: props,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        setTimeout(() => {
          activeBullet.active = true;
        }, 3000);
        activeBullet.setVisible(false).setPosition(this.x, this.y).setDepth(1);

        if (callback) {
          callback(activeBullet);
        }
      }
    });
  }
}
