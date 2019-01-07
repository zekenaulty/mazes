(function () {
  "use strict";

  const DEBUG = {
    carving: false,
    draw: false,
    pathfinding: true
  };

  let app = angular.module("mazes", []);

  app.constant("DEBUG", DEBUG);

  Array.prototype.sample = function () {
    if (this.length === 1) return this[0];
    if (this.length === 0) return null;

    return this[Math.floor(Math.random() * this.length)];
  };
})();