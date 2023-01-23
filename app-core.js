import { go } from './isReady.js';
import { View } from './grid/view.js';

Array.prototype.sample = function() {
  if (this.length === 1) return this[0];
  if (this.length === 0) return undefined;

  return this[Math.floor(Math.random() * this.length)];
};

import { Binary } from './mazes/binary.js';
import { Sidewinder } from './mazes/sidewinder.js';


go(() => {

  let rooms = 16;
  let factor = 0.15;
  let level = 0;
  const stage = document.querySelector('.stage');
  const _level = document.querySelector('.level');

  const maze = new View(stage, rooms);
  const binary = new Binary(maze);
  const sidewinder = new Sidewinder(maze);

  const generators = [
   /* () => {
      binary.generate();
    }, */
    () => {
      sidewinder.generate();
    },
  ];

  const generate = () => {
    disable();
    if (level === max_level) {
      alert(`WINNER!!! This device can only go to level ${max_level}! You\'ve WON!`);
      level = 0;
      rooms = 16;
    }
    level++;
    rooms = rooms + Math.ceil(rooms * factor);
    maze.resize(rooms);
    generators.sample()();
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
  const max_level = 40;
  /*
    view.addEventListener(
      'click',
      (e) => {
        const westly = view.width / 4;
        const eastly = westly * 3;
        const northly = view.height / 4;
        const southly = northly * 3;

        if (e.clientX < westly &&
          e.clientY > northly &&
          e.clientY < southly) {
          move('west');
        } else if (e.clientX > eastly &&
          e.clientY > northly &&
          e.clientY < southly) {
          move('east');
        } else if (e.clientY < northly) {
          move('north');
        } else if (e.clientY > southly) {
          move('south');
        }
      });
  */

  /*
    view.addEventListener(
      'touchstart',
      (e, n) => {
        maze.fill();
      });

    view.addEventListener(
      'touchmove',
      (e, n) => {
        let colors = [
          'red',
          'yellow',
          'orange',
          'cyan',
          'magenta'
          ];
        for (let i = 0; i < e.touches.length; i++) {
          let t = e.touches[i];
          maze.trace(t.clientX, t.clientY, colors[i]);
        }
      });

    view.addEventListener(
      'touchend',
      (e, n) => {});
    
    */

  const left = document.querySelector('.left');
  const right = document.querySelector('.right');
  const up = document.querySelector('.up');
  const down = document.querySelector('.down');
  const skip = document.querySelector('.skip');
  const solve = document.querySelector('.solve');
  const reset = document.querySelector('.reset');
  const histogram = document.querySelector('.histogram');

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

  generate();

});
