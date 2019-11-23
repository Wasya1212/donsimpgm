import { Unit, UnitConfig } from "./unit";
import { RangeWeapon as Weapon } from "./weapon";
import { getKey } from "./keys";

interface PlayerConfig extends UnitConfig {
  control?: boolean
}

export default class Player extends Unit {
  private config: PlayerConfig;
  public weapon: Weapon;

  constructor(config: PlayerConfig) {
    super(config);

    this.config = config;

    this.weapon = new Weapon({
      scene: this.config.scene,
      x: this.config.x,
      y: this.config.y,
      key: "slingshot",
      bulletFrames: [ "bullet-type-1", "bullet-type-2", "bullet-type-3", "bullet-type-4", "bullet-type-5", "bullet-type-6" ],
      bulletSpeed: 0.35
    });
  }

  public setHealth(health: number) {
    this.health = health;
  }

  public turnOnControl() {
    this.config.control = true;
  }

  public turnOffControl() {
    this.config.control = false;
  }

  public toggleControl() {
    this.config.control = !this.config.control;
  }

  public setControl(button: Phaser.Input.Keyboard.Key, event: string, callback?: (player?: Player) => void) {
    this.scene.input.keyboard.on(`${event}-${getKey(button.keyCode)}`, () => {
      if (this.config.control) {
        callback(this);
      }
    }, this.scene);
  }

  public shoot(startCoords: { x: number, y: number }, endCoords: { x?: number, y?: number}, callback?: (bullet?: any) => void) {
    this.weapon.shoot(startCoords, endCoords, (bullet: any) => {
      bullet.setPosition(this.weapon.x, this.weapon.y);
      try {
        callback(bullet);
      } catch (err) { }
    });
  }
}
