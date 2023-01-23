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


go(() => {
  let mazeIndex = 0;
  let rooms = 16;
  let factor = 0.15;
  let level = 0;
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

  const generators = [
      binary,
      sidewinder,
      aldousBroder,
      wilsons,
      huntKill
  ];

  const generate = (stay) => {
    disable();
    setTimeout(() => {
      if (!stay) {
        level++;
        rooms = rooms + Math.ceil(rooms * factor);
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
      Level:          ${level} <br />
      Rooms:          ${maze.roomCount} <br />
      Dead Ends;:     ${maze.deadends.length} <br />
      Rooms Visited:  ${maze.visited.length} <br />
      Moves Made:     ${maze.moves} <br />
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

  mazeIndex = 4; //Math.floor(Math.random() * generators.length);
  mazes.selectedIndex = mazeIndex;

  document.querySelector('.playerColor').style.backgroundColor = maze.activeColor;
  document.querySelector('.endColor').style.backgroundColor = maze.endColorOne;

  generate();


});
