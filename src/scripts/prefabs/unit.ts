import * as Phaser from "phaser";

export interface UnitConfig {
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  physics?: boolean,
  health: number
}

export class Unit extends  Phaser.Physics.Arcade.Sprite {
  protected health: number;
  protected events: any = {};

  constructor(config: UnitConfig) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.add.existing(this);

    this.health = config.health || 100;

    if (config.physics) {
      this.activatePhysics();
    }
  }

  private activatePhysics() {
    this.scene.physics.world.enable([ this ]);

    // default physic
    this.setBounce(1, 1);
    this.setCollideWorldBounds(true);
  }

  public addEvent(eventName: string) {
    this.events[eventName] = false;
  }

  public setEvent(eventName: string, state: boolean) {
    this.events[eventName] = state;
  }

  public emitEvent(eventName: string) {
    this.events[eventName] = true;
  }

  public absorbEvent(eventName: string) {
    this.events[eventName] = false;
  }

  public checkEventState(eventName: string): boolean {
    return this.events[eventName] || false;
  }

  public setTo(x: number, y: number, animationKey?: string | null) {
    this.play(animationKey);
    this.setVisible(true);
    this.setScale(1);
    this.setDepth(1);
    this.setX(x);
    this.setY(y);
  }

  public addAnimation(title: string, frameRate: number = 10, startFrame?: number, endFrame?: number) {
    this.scene.anims.create({
      key: title,
      frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: startFrame || 1, end: endFrame || 1 }),
      frameRate: frameRate,
      repeat: -1,
      yoyo: true
    });
  }

  public useAnimation(animationKey?: string | null) {
    try {
      this.play(animationKey);
    } catch (err) {
      console.error(err);
    }
  }

  public hit(damage: number) {
    this.health += damage;
  }

  public kill(killAnimationKey?: string | null) {
    this.health = 0;

    if (killAnimationKey) {
      try {
        //@ts-ignore
        this.useAnimation(killAnimationKey);
      } catch (e) {
        console.error(e);
      }
    }

    this.setVisible(false);
    this.destroy();
  }
};
