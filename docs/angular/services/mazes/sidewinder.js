(function () {
    "use strict";

    angular.module("mazes").service("sidewinder", function (maze) {
        this.Maze = function (rows, columns, roomWidth, roomHeight) {
            this.grid = maze.new(rows, columns, roomWidth, roomHeight);
            this.name = 'Binary Tree';
            this.description = ``;
            this.generate = function () {
                const iRows = this.grid.rows();
                for (let row of iRows) {
                    let run = [];

                    const iCells = row.cells();
                    for (let cell of iCells) {
                        run.push(cell);

                        let eastEnd = cell.neighbors.east === null;
                        let northEnd = cell.neighbors.north === null;
                        let closeRun = eastEnd || (!northEnd && Math.floor(Math.random() * 2) === 0);

                        if (closeRun) {
                            let closeFrom = run.sample();
                            closeFrom.carve('north');
                            run = [];
                        } else {
                            cell.carve('east');
                        }
                    }
                }
            };

            this.draw = function (gfx, bg, fg) {
                this.grid.draw(gfx, bg, fg);
            };
        };
    });
})();