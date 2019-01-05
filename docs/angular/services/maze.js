(function () {
    "use strict";

    angular.module("mazes").service("maze", function () {
        this.new = function (rowCount, columnCount, roomWidth, roowHeight, ) {

            function Cell(maze, row, column, width, height) {

                this.maze = maze;
                this.row = row;
                this.column = column;
                this.width = width;
                this.height = height;
                this.x = row * width;
                this.y = column * height;
                this.links = {};

                this.key = function () {
                    return this.row + ',' + this.column;
                };

                this.link = function (cell, biDirectional = true) {
                    this.links[cell.key()] = true;
                    if (biDirectional)
                        cell.link(this, false)
                };

                this.unlink = function (cell, biDirectional = true) {
                    delete this.links[cell.key()];
                    if (biDirectional)
                        cell.unlink(this, false)
                };

                this.walls = {
                    north: true,
                    east: true,
                    south: true,
                    west: true
                };

                this.neighbors = {
                    north: null,
                    east: null,
                    south: null,
                    west: null
                };

                this.findNeighbors = function () {
                    if (this.row > 0)
                        this.neighbors.north = this.maze[this.row - 1][this.column];

                    if (this.column < this.maze[this.row].length - 1)
                        this.neighbors.east = this.maze[this.row][this.column - 1];

                    if (this.row < this.maze.length - 1)
                        this.neighbors.south = this.maze[this.row + 1][this.column];

                    if (this.column > 0)
                        this.neighbors.west = this.maze[this.row][this.column - 1];
                };

                this.carve = function (direction) {
                    let d = direction.toLowerCase();

                    if (d === 'north' && this.neighbors.north) {
                        this.walls.north = false;
                        this.neighbors.north.walls.south = false;
                        this.link(this.neighbors.north, true);
                        return true;
                    }

                    if (d === 'east' && this.neighbors.east) {
                        this.walls.east = false;
                        this.neighbors.east.walls.west = false;
                        this.link(this.neighbors.east, true);
                        return true;
                    }

                    if (d === 'south' && this.neighbors.south) {
                        this.walls.south = false;
                        this.neighbors.south.walls.north = false;
                        this.link(this.neighbors.south, true);
                        return true;
                    }

                    if (d === 'west' && this.neighbors.west) {
                        this.walls.west = false;
                        this.neighbors.west.walls.east = false;
                        this.link(this.neighbors.west, true);
                        return true;
                    }

                    return false;
                };

                this.draw = function (gfx) {
                    //north wall?
                    if (this.walls.north) {
                        gfx.beginPath();
                        gfx.moveTo(this.x, this.y);
                        gfx.lineTo(this.width + this.x, this.y);
                        gfx.closePath();
                        gfx.stroke();
                    }
                    //east wall?
                    if (this.walls.east) {
                        gfx.beginPath();
                        gfx.moveTo(this.width + this.x, this.y);
                        gfx.lineTo(this.width + this.x, this.y + this.height);
                        gfx.closePath();
                        gfx.stroke();
                    }
                    //south wall?
                    if (this.walls.south) {
                        gfx.beginPath();
                        gfx.moveTo(this.x, this.height + this.y);
                        gfx.lineTo(this.x + this.width, this.height + this.y);
                        gfx.closePath();
                        gfx.stroke();
                    }
                    //west wall?
                    if (this.walls.west) {
                        gfx.beginPath();
                        gfx.moveTo(this.x, this.y + this.height);
                        gfx.lineTo(this.x, this.y);
                        gfx.closePath();
                        gfx.stroke();
                    }
                };
            }

            function createMaze(rows, columns, cellWidth, cellHeight) {
                let maze = [];

                maze.rowCount = rows;
                maze.cellCount = columns;
                maze.cellWidth = cellWidth;
                maze.cellHeight = cellHeight;

                maze.cell = function (row, column) {
                    if (row >= this.length)
                        return null;

                    if (column >= this[row].length)
                        return null;

                    return this[row][column];
                };

                maze.config = function () {
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < columns; c++) {
                            if (this[r][c]) {
                                this.cell(r, c).findNeighbors();
                            }
                        }
                    }
                };

                maze.init = function (rows, columns) {
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; 0 < columns; c++) {
                            if (this.length < r - 1)
                                this.push([]);

                            this[r].push(new Cell(this, r, c, rw, rh));
                        }
                    }
                    this.config();
                };

                maze.rows = function* () {
                    for (let r = 0; r < this.length; r++) {
                        yield this[r];
                    }
                };

                maze.cells = function* () {
                    for (let r = 0; r < this.length; r++) {
                        for (let c = 0; c < this[r].length; c++) {
                            yield this.cell(r, c);
                        }
                    }
                };

                maze.randomCell = function () {
                    let r = Math.floor(Math.random() * this.length);
                    let c = Math.floor(Math.random() * this[r].length);

                    return this.cell(r, c);
                };

                maze.totalCells = function () {
                    return this.rowCount * this.cellCount;
                };

                maze.draw = function (gfx) {
                    try {
                        let c = this.cells.next();
                        while (!c.done) {
                            c.value.draw(gfx);
                            c = this.cells.next();
                        }
                    } catch {
                        /* browser throws at last element */
                    }
                };
            }

            return createMaze(rowCount, columnCount, roomWidth, roowHeight);
        };
    });
})();