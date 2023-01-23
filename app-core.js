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
    if(level === max_level){
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
  };

  const move = (dir) => {
    maze.move(dir);
    if (maze.active === maze.end) {
      generate();
    }
    msg();
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
    
  document.querySelector('.skip').addEventListener('click', () => {
    generate();
  });

  document.querySelector('.reset').addEventListener('click', () => {
    maze.visited.length = 0;
    maze.moves = 0;
    maze.active = maze.start;
    maze.draw();
  });

  const lb = document.querySelector('.left');
  const rb = document.querySelector('.right');
  const ub = document.querySelector('.up');
  const db = document.querySelector('.down');

  lb.addEventListener('click', () => {
    move('west');
  });

  ub.addEventListener('click', () => {
    move('north');
  });

  db.addEventListener('click', () => {
    move('south');
  });

  rb.addEventListener('click', () => {
    move('east');
  });

  generate();
  
});
