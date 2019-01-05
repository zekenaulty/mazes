(function () {
  "use strict";

  angular.module("mazes", ["ui.router"]);

  Array.prototype.sample = function () {
    if (this.length === 1) return thhis[0];
    if (this.length === 0) return null;

    return this[Math.floor(Math.random() * this.length)];
  };
})();