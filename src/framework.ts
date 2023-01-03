export class GameState {
  enter() {}
  update() {}
  exit() {}
}

export class GameStateMachine {
  state: GameState | undefined;

  transition(nextState: GameState): void {
    this.state?.exit();
    this.state = nextState;
    this.state?.enter();
  }
}
