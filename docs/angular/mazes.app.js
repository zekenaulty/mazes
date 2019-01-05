(function () {
  "use strict";

  const ROW_COUNT = 36;
  const COLUMN_COUNT = 36;
  const CELL_WIDTH = 16;
  const CELL_HEIGHT = 16;
  const CANVAS_WIDTH = ROW_COUNT * CELL_WIDTH;
  const CANVAS_HEIGHT = COLUMN_COUNT * CELL_HEIGHT;

  let app = angular.module("mazes", []);

  app.constant("ROW_COUNT", ROW_COUNT);
  app.constant("COLUMN_COUNT", COLUMN_COUNT);
  app.constant("CELL_WIDTH", CELL_WIDTH);
  app.constant("CELL_HEIGHT", CELL_HEIGHT);
  app.constant("CANVAS_WIDTH", CANVAS_WIDTH);
  app.constant("CANVAS_HEIGHT", CANVAS_HEIGHT);

  Array.prototype.sample = function () {
    if (this.length === 1) return this[0];
    if (this.length === 0) return null;

    return this[Math.floor(Math.random() * this.length)];
  };
})();