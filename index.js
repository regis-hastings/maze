const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body, // where to show the render
	engine: engine, // specify which engine to use
	options: {
		width,
		height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }), // top wall
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }), // bottom wall
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }), // left wall
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }) // right wall
];

World.add(world, walls);

// Maze generation

const grid = Array(3).fill(null).map(() => Array(3).fill(false));
