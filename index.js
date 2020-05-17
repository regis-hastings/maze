const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

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

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }), // top wall
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }), // bottom wall
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }), // left wall
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }), // right wall
];

World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
  // arr = [a, b, c, d]
  let counter = arr.length; // 4

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter); // 2 / 0

    counter--; // 3 / 2

    const temp = arr[counter]; 	// temp = d 								/ temp = d
    arr[counter] = arr[index]; 	// arr[3] = c [a, b, c, c] 	/ arr[2] = a [a, b, a, c]
    arr[index] = temp; 					// arr[2] = d [a, b, d, c] 	/ arr[0] = d [d, b, a, c]
  }

  return arr;
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

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row, column], the return
  if (grid[row][column]) {
    return;
  }

  // Mark this cell as being visited
  grid[row][column] = true;

  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column], // above
    [row, column + 1], // right
    [row + 1, column], // below
    [row, column - 1], // left
  ]);

  // For each neighbor...

  // See if that neighbor is out of bounds

  // If we have visited that neighbor, continue to next neighbor

  // Remove a wall from either horizontals or verticals

  // Visit that next cell
};

stepThroughCell(startRow, startColumn);
