import { go } from './isReady.js';
import { View } from './grid/view.js';

Array.prototype.sample = function() {
  if (this.length === 1) return this[0];
  if (this.length === 0) return undefined;

  return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.delete = function(e) {
  if (this.length === 0) return;
  let idx = this.indexOf(e);
  if (idx < 0) return;
  this.splice(idx, 1);
};

import { Binary } from './mazes/binary.js';
import { Sidewinder } from './mazes/sidewinder.js';
import { AldousBroder } from './mazes/aldousBroder.js';
import { Wilsons } from './mazes/wilsons.js';


go(() => {
  let mazeIndex = 0;
  let rooms = 16;
  let factor = 0.15;
  let level = 0;
  const stage = document.querySelector('.stage');
  const _level = document.querySelector('.level');

  const maze = new View(stage, rooms);
  const binary = new Binary(maze);
  const sidewinder = new Sidewinder(maze);
  const aldousBroder = new AldousBroder(maze);
  const wilsons = new Wilsons(maze);

  const generators = [
      binary,
      sidewinder,
      aldousBroder,
      wilsons
  ];

  const generate = (stay) => {
    disable();
    if (!stay) {
      level++;
      rooms = rooms + Math.ceil(rooms * factor);
    }
    maze.resize(rooms);
    generators[mazeIndex].generate();
    maze.visited.push(maze.start);
    maze.draw();
    msg();
    enable();
  };

  const move = (dir) => {
    disable();
    maze.move(dir);
    if (maze.active === maze.end) {
      generate();
    } else {
      msg();
    }
    enable();
  };

  const msg = () => {
    _level.innerHTML = ` Level:         ${level}
 Rooms:         ${maze.roomCount}
 Rooms Visited: ${maze.visited.length}
 Moves Made:    ${maze.moves}
 End Point:     ${maze.end.row},${maze.end.column}
    `;
  };

  const view = stage.firstElementChild;
  const left = document.querySelector('.left');
  const right = document.querySelector('.right');
  const up = document.querySelector('.up');
  const down = document.querySelector('.down');
  const skip = document.querySelector('.skip');
  const solve = document.querySelector('.solve');
  const reset = document.querySelector('.reset');
  const histogram = document.querySelector('.histogram');
  const mazes = document.querySelector('.mazes');

  const disable = () => {
    left.disabled = true;
    right.disabled = true;
    up.disabled = true;
    down.disabled = true;
    skip.disabled = true;
    solve.disabled = true;
    reset.disabled = true;
    histogram.disabled = true;
  };

  const enable = () => {
    left.disabled = false;
    right.disabled = false;
    up.disabled = false;
    down.disabled = false;
    skip.disabled = false;
    solve.disabled = false;
    reset.disabled = false;
    histogram.disabled = false;
  };

  skip.addEventListener('click', () => {
    generate();
  });

  histogram.addEventListener('click', () => {
    maze.showDistance = !maze.showDistance;
    maze.draw();
  });

  solve.addEventListener('click', () => {
    disable();
    maze.solve();
    enable();
  });

  reset.addEventListener('click', () => {
    disable();
    maze.visited.length = 0;
    maze.moves = 0;
    maze.active = maze.start;
    maze.solution = undefined;
    maze.draw();
    enable();
  });

  left.addEventListener('click', () => {
    move('west');
  });

  up.addEventListener('click', () => {
    move('north');
  });

  down.addEventListener('click', () => {
    move('south');
  });

  right.addEventListener('click', () => {
    move('east');
  });

  for (let g = 0; g < generators.length; g++) {
    let o = new Option(generators[g].name);
    mazes.add(o);
  }

  mazes.addEventListener('change', () => {
    mazeIndex = mazes.selectedIndex;
    generate(true);
  });

  mazeIndex = Math.floor(Math.random() * generators.length);
  mazes.selectedIndex = mazeIndex;

  generate();

});
