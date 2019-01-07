(function () {
    "use strict";

    angular.module("mazes").service("sidewinder", function (maze) {
        this.Maze = function (rows, columns, roomWidth, roomHeight) {
            this.grid = maze.new(rows, columns, roomWidth, roomHeight);
            this.name = 'Sidewinder';
            this.description = `The sidewinder always carves N or E. When carving east the cell is collected into a series. When we can no longer go east or, our coin toss tells us to go north, a random cell from said series is carved north, and we reset the series.`;


            this.generate = function () {


                for (let r = 0; r < this.grid.length; r++) {
                    let row = this.grid[r];
                    let run = [];
                    let directions = ['north', 'east'];

                    for (let c = 0; c < row.length; c++) {
                        let cell = row[c];
                        run.push(cell);

                        let canGoEast = cell.neighbors.east !== null;
                        let canGoNorth = cell.neighbors.north !== null;
                        let closeRun = !canGoEast || (canGoNorth && Math.floor(Math.random() * 2) === 0);

                        if (closeRun) {
                            let n = run.sample();
                            n.carve('north');
                            run = [];
                        } else {
                            cell.carve('east');
                        }
                    }
                }

                this.start = this.grid[0][columns - 1];
                this.end = this.grid[rows - 1][columns - 1];

            };

            this.draw = function (gfx, bg, fg) {
                this.grid.draw(gfx, bg, fg);
            };
        };
    });
})();