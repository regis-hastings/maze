const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cells = 6;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body, // where to show the render
  engine: engine, // specify which engine to use
  options: {
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Border Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }), // top wall
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }), // bottom wall
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }), // left wall
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }), // right wall
];

World.add(world, walls);

// Maze generation

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

// Randomly generate a starting point on grid
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row, column], then return
  if (grid[row][column]) return; 

  // Mark this cell as being visited
  grid[row][column] = true;

  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // For each neighbor...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    // See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }

    // If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) continue;

    // Remove a wall from either horizontals or verticals
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    // Visit next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

// Draw Maze Walls

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2, // x-coordinate
      rowIndex * unitLength + unitLength, // y-coordinate
      unitLength,
      5,
      {
        isStatic: true,
        label: 'wall'
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      5,
      unitLength,
      {
        isStatic: true,
        label: 'wall'
      }
    );
    World.add(world, wall);
  });
});

// Goal
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.5,
  unitLength * 0.5,
  {
    isStatic: true,
    label: 'goal'
  }
);
World.add(world, goal);

// Ball
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength * 0.25, {
  label: 'ball'
});
World.add(world, ball);

document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;

  if (event.keyCode === 87) {
    Body.setVelocity(ball, {x, y: y - 5})
  }
  if (event.keyCode === 68) {
    Body.setVelocity(ball, {x: x + 5, y})
  }
  if (event.keyCode === 83) {
    Body.setVelocity(ball, {x, y: y + 5})
  }
  if (event.keyCode === 65) {
    Body.setVelocity(ball, {x: x - 5, y})
  }
});

// Win Condition

Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach((collision) => {
    const labels = ['ball', 'goal'];

    if (
      labels.includes(collision.bodyA.label) && 
      labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
