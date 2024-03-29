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
import { HuntAndKill } from './mazes/huntAndKill.js';
import { RecursiveBacktracker } from './mazes/recursiveBacktracker.js';

go(() => {
  let mazeIndex = 0;
  let rooms = 12;
  let factor = 0.35;
  let level = 0;
  let perfectSolve = -1;
  const stage = document.querySelector('.stage');
  const loaderBackdrop = document.querySelector('#loader-backdrop');
  const loaderText = document.querySelector('#loader-text');
  const loader = (show) => {
    if (show) {
      loaderBackdrop.classList.remove('hide');
      loaderText.classList.remove('hide');
    } else {
      loaderBackdrop.classList.add('hide');
      loaderText.classList.add('hide');
    }
  };
  const _level = document.querySelector('.level');
  const maze = new View(stage, rooms);
  const binary = new Binary(maze);
  const sidewinder = new Sidewinder(maze);
  const aldousBroder = new AldousBroder(maze);
  const wilsons = new Wilsons(maze);
  const huntKill = new HuntAndKill(maze);
  const recursiveBacktracker = new RecursiveBacktracker(maze);

  const generators = [
      binary,
      sidewinder,
      aldousBroder,
      wilsons,
      huntKill,
      recursiveBacktracker
  ];

  const generate = (stay) => {
    disable();
    setTimeout(() => {
      if (!stay) {
        level++;
        rooms = rooms + Math.ceil(rooms * factor);
        if(maze.visited.length === maze.moves) {
          perfectSolve++;
        }
      }
      maze.roomCount = rooms;
      generators[mazeIndex].generate();
      msg();
      setTimeout(() => {
        enable();
      }, 200);
    }, 75);
  };

  const move = (dir) => {
    maze.move(dir);
    if (maze.active === maze.end) {
      generate();
    } else {
      msg();
    }
  };

  const msg = () => {
    _level.innerHTML = `  
      Level: ${level}, Solved Perfectly: ${perfectSolve}<br />
      Rooms: ${maze.roomCount}, Dead Ends: ${maze.deadends.length} <br />
      Rooms Visited: ${maze.visited.length}, Moves Made: ${maze.moves}
      
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
  const hand = document.querySelector('.hand');
  const foot = document.querySelector('.foot');
  const joy = document.querySelector('.move');

  const disable = () => {
    loader(true);
  };

  const enable = () => {
    loader(false);
  };

  skip.addEventListener('click', () => {
    generate();
  });

  hand.addEventListener('click', () => {
    if(hand.innerHTML === '&lt;') {
      foot.style.justifyContent = 'start';
      joy.style.order = 1;
      hand.style.order = 2;
      hand.innerHTML = '&gt;';
    } else {
      foot.style.justifyContent = 'end';
      hand.style.order = 1;
      joy.style.order = 2;
      hand.innerHTML = '&lt;';
    }
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

  mazeIndex = 5; //Math.floor(Math.random() * generators.length);
  mazes.selectedIndex = mazeIndex;

  document.querySelector('.playerColor').style.backgroundColor = maze.activeColor;
  document.querySelector('.endColor').style.backgroundColor = maze.endColorOne;

  generate();


});
