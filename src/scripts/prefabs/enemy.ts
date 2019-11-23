import { Unit, UnitConfig } from "./unit";

interface EnemyConfig extends UnitConfig {
  collisionDamage: number
}

export default class Enemy extends Unit {
  private config: EnemyConfig;
  private AIStatus: boolean = false;

  constructor(config: EnemyConfig) {
    super(config);

    this.config = config;
  }

  get ai():boolean {
    return this.AIStatus;
  }

  public setAI(action: (enemy: Enemy) => void): void {
    this.setEvent("include intelligence", false);

    this.preUpdate = () => {
      try {
        if (this.checkEventState("include intelligence") === true) {
          action(this);
        }
      } catch (err) {
        console.error(err);
      }
    };
  }

  public activateAI(): void {
    this.emitEvent("include intelligence");
    this.AIStatus = true;
  }

  public deactivateAI(): void {
    this.absorbEvent("include intelligence");
    this.AIStatus = false;
  }
}
