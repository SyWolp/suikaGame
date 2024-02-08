import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";

import { FRUITS } from "./common/Fruits/Fruits.js";

const wrap = document.querySelector(".wrap");
const score = document.querySelector(".score");
const engine = Engine.create();
const showRender = Render.create({
  engine,
  element: wrap,
  options: {
    wireframes: false,
    background: "#f7f4c8",
    width: 850,
    height: 850,
  },
});

const world = engine.world;
const waitFruit = [
  Math.floor(Math.random() * 5),
  Math.floor(Math.random() * 5),
];

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#e6b143" },
});

const RightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#e6b143" },
});

const floor = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#e6b143" },
});

const finishLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "finishLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#e6b143" },
});

const showWaitFruitBox = Bodies.circle(735, 150, 80, {
  isStatic: true,
  render: {
    strokeStyle: "green",
    fillStyle: "transparent",
    lineWidth: 2,
  },
});

World.add(world, [leftWall, RightWall, floor, finishLine, showWaitFruitBox]);

Render.run(showRender);
Runner.run(engine);
let currentBody = null;
let currentFruit = null;
let nextBody = null;
let disableAction = false;
let interval = undefined;

const addFruit = () => {
  const index = waitFruit.pop();
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    restitution: 0.2,
    isSleeping: true,
    index: index,
    render: {
      sprite: { texture: ``, xScale: 1, yScale: 1 },
      fillStyle: fruit.color,
    },
  });

  const Nbody = Bodies.circle(735, 150, FRUITS[waitFruit[0]].radius, {
    isStatic: true,
    render: {
      sprite: { texture: ``, xScale: 1, yScale: 1 },
      fillStyle: FRUITS[waitFruit[0]].color,
    },
  });

  currentBody = body;
  currentFruit = fruit;

  nextBody = Nbody;

  World.add(world, [body, nextBody]);
};

window.onkeydown = (event) => {
  if (currentBody === null || disableAction) return;
  switch (event.code) {
    case "KeyA":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody?.position.x - currentFruit.radius > 30) {
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
        }
      }, 5);
      break;

    case "KeyD":
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody?.position.x + currentFruit.radius < 590) {
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
        }
      }, 5);
      break;
    case "Space":
      currentBody.isSleeping = false;
      disableAction = true;
      clearInterval(interval);
      interval = undefined;
      waitFruit.unshift(Math.floor(Math.random() * 5));

      setTimeout(() => {
        World.remove(world, nextBody);

        addFruit();
        disableAction = false;
      }, 1000);
      break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = undefined;
      break;
  }
};

Events.on(engine, "collisionStart", (event) => {
  console.log([...event.pairs]);
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: ``, xScale: 1, yScale: 1 },
            fillStyle: newFruit.color,
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);

      if (!!score)
        score.innerHTML = `${(index + 1) * 100 + parseInt(score.innerHTML)}`;
    }

    if (
      (!disableAction && collision.bodyA.name === "finishLine") ||
      collision.bodyB.name === "finishLine"
    ) {
      const restart = confirm("다시 하시겠습니까?");
      if (restart) {
        window.location.reload();
      }
    }
  });
});

addFruit();
