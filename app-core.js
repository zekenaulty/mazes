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

  let rooms = 96;
  let factor = 0.15;
  let level = 0;
  const stage = document.querySelector('.stage');
  const _level = document.querySelector('.level');

  const maze = new View(stage, rooms);
  const binary = new Binary(maze);
  const sidewinder = new Sidewinder(maze);

  const generators = [
    () => {
      binary.generate();
      _level.innerHTML = `${level}, <span style="font-size:small;">${binary.name}: ${binary.description}</span>`;

    },
    () => {
      sidewinder.generate();
      _level.innerHTML = `${level}, <span style="font-size:small;">${sidewinder.name}: ${sidewinder.description}</span>`;
      },
  ];

  const generate = () => {
    level++;
    rooms = rooms + Math.floor(rooms * factor);
    maze.resize(rooms);
    generators.sample()();
    maze.draw();
  };

  const move = (dir) => {
    maze.move(dir);
    if (maze.active === maze.end) {
      generate();
    }
  };

  const view = stage.firstElementChild;

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

  view.addEventListener(
    'swipe',
    (e) => {
      console.log(e);
    });
  document.querySelector('.g').addEventListener('click', () => {
    generate();
  });
  document.querySelector('.d').addEventListener('click', () => {
    maze.active = maze.start;
    maze.draw();
  });
  document.querySelector('.f').addEventListener('click', () => {
    maze.fill();
  });
  generate();
});