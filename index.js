const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 300;
const height = 300;

const unitLength = width / cells;

const engine = Engine.create();
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
  if (grid[row][column]) return; // not yet

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
    console.log(`Possible move: ${nextRow}, ${nextColumn}`);
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
    console.log(`Stepping through to: ${nextRow}, ${nextColumn}`);
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);
console.log(`Starting cell: ${startRow},${startColumn}`);

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
      }
    );
    World.add(world, wall);
  });
});

const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.5,
  unitLength * 0.5,
  {
    isStatic: true,
  }
);
World.add(world, goal);
