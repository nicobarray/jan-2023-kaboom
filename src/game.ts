import kaboom from "kaboom";
import { Player, PlayerChargeState, PlayerIdleState } from "./player";

kaboom({
  background: [0, 0, 0],
  width: 1024,
  height: 768,
  root: document.querySelector("#app"),
});

// Game asset loading.
loadSprite("sun", "/sun.png");
loadSprite("moon", "/moon.png");

// Game setup.

// Map setup.
for (let i = 0; i < 1000; i++) {
  const size = rand(1, 4);
  add([
    rect(size, size),
    pos(rand(-width() * 3, width() * 3), rand(-height() * 3, height() * 3)),
    opacity(rand()),
  ]);
}

// Player setup.
let player = new Player();
player.transition(new PlayerIdleState(player));

// Camera setup.
const Camera = () => {
  camScale(vec2(0.5, 0.5));

  return {
    update() {
      camPos(player.sun.pos);
    },
  };
};
const camera = Camera();

// Main game update.
onUpdate(() => {
  player.state?.update();
  camera.update();
});

// Player inputs.
onKeyPress("space", () => {
  if (player.state instanceof PlayerIdleState) {
    player.transition(new PlayerChargeState(player));
  }
});

onKeyRelease("space", () => {
  if (player.state instanceof PlayerChargeState) {
    player.transition(new PlayerIdleState(player));
  }
});
