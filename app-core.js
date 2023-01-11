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

  const stage = document.querySelector('.stage');
  const maze = new View(stage, 2048);
  const binary = new Binary(maze);
  const sidewinder = new Sidewinder(maze);

  const generators = [
    () => { binary.generate(); },
    () => { sidewinder.generate(); },
  ];

  stage.firstElementChild.addEventListener(
    'click',
    () => {
      if (maze.drawing === 0) {
        maze.seal();
        generators.sample()();
        maze.draw();
      }
    });
    
    //trigger github pages publish!?!?!?!

});
