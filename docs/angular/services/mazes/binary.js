(function () {
    "use strict";

    angular.module("mazes").service("binary", function (maze) {
        this.Maze = function (rows, columns, roomWidth, roomHeight) {
            this.grid = maze.new(rows, columns, roomWidth, roomHeight);
            this.name = 'Binary Tree';
            this.description = ``;
            this.generate = function () {
                this.grid.init();

                const iCells = this.grid.cells();
                for (let cell of iCells) {
                    let neighbors = [];

                    if (cell.neighbors.north)
                        neighbors.push('north');

                    if (cell.neighbors.east)
                        neighbors.push('east');

                    let dir = neighbors.sample();
                    if (dir) cell.carve(dir);
                }
            };

            this.draw = function (gfx, bg, fg) {
                this.grid.draw(gfx, bg, fg);
            };

        };
    });
})();