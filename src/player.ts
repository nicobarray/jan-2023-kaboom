import { type Vec2, GameObj } from "kaboom";
import { GameState, GameStateMachine } from "./framework";

class PlayerState extends GameState {
  constructor(protected player: Player) {
    super();
  }
}

export class Player extends GameStateMachine {
  sun: GameObj;
  moon: GameObj;

  velocity = vec2(0, 0);

  constructor() {
    super();

    this.sun = add([
      sprite("sun"),
      pos(400, 400),
      scale(0.2),
      rotate(0),
      // @ts-ignore
      origin("center"),
      area(),
      solid(),
    ]);

    this.moon = add([
      sprite("moon"),
      pos(0, 0),
      scale(0.03),
      rotate(0),
      // @ts-ignore
      origin("center"),
    ]);
  }

  rotatePlayer(): void {
    this.sun.angle += 90 * dt();
    this.moon.angle += 70 * dt();

    this.moon.moveTo(
      // @ts-ignore
      vec2(this.sun.pos).add(Vec2.fromAngle(this.sun.angle).scale(150))
    );
  }

  applyMoonForce(force: number): void {
    this.velocity = this.getDir().scale(10 * force);
  }

  getDir() {
    return this.sun.pos.sub(this.moon.pos).unit();
  }

  chargeForce(force: number): void {
    this.moon.moveTo(
      // @ts-ignore
      vec2(this.sun.pos).add(Vec2.fromAngle(this.sun.angle).scale(150 + force))
    );
  }

  updateVelocity(): void {
    if (this.velocity.len() > 1.5) {
      this.velocity = this.velocity.scale(0.98);
    } else if (!this.velocity.eq(vec2(0, 0))) {
      this.velocity = vec2(0, 0);
    }

    this.sun.move(this.velocity);
  }
}

export class PlayerIdleState extends PlayerState {
  constructor(player: Player) {
    super(player);
  }

  update(): void {
    super.update();

    this.player.rotatePlayer();
    this.player.updateVelocity();
  }
}

export class PlayerChargeState extends PlayerState {
  force: number = 0;

  enter(): void {
    this.force = 0;
  }

  update(): void {
    super.update();

    this.player.updateVelocity();

    this.force += 100 * dt();

    this.player.chargeForce(this.force);

    shake(this.force / 90);
  }

  exit(): void {
    this.player.applyMoonForce(this.force);
    shake(10);
  }
}
