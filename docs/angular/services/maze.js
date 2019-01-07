(function () {
    "use strict";

    /*

        I feel that it is important to note, that I have mild dyslexia, 
        and while I know y => row and x => column, every time I write code 
        of this nature I have to debug it very carefully to find the places where
        I was not dilligent while typing to correct the diviation of my use
        of row/column. This is probably the biggest challenge I have faced with
        most types of algorithims, especialy fractals and mazes, and why I
        most often avoid them. 

        As a side note, I've been told it is also why my spelling is poor, but idk...

    */
    angular.module("mazes").service("maze", function ($log, DEBUG) {
        this.new = function (rowCount, columnCount, roomWidth, roomHeight) {

            class Cell {
                constructor(grid, row, column, width, height) {
                    //I should do this properly later with get/set, but with no read only we should be fine
                    this.grid = grid;
                    this.row = row;
                    this.column = column;
                    this.width = width;
                    this.height = height;
                    this.x = column * width;
                    this.y = row * height;
                    this.links = {};

                    //this is a helper for working with linked passges
                    this.walls = {
                        north: true,
                        east: true,
                        south: true,
                        west: true
                    };

                    //keep up with the joneses?
                    this.neighbors = {
                        north: null,
                        east: null,
                        south: null,
                        west: null
                    };

                    this.key = function () {
                        return this.row + ',' + this.column;
                    };

                    this.rect = {
                        x1: column * width,
                        y1: row * height,
                        x2: column * width + width,
                        y2: row * height + height
                    };

                    this.lines = {
                        north: {
                            x1: column * width,
                            y1: row * height,
                            x2: column * width + width,
                            y2: row * height
                        },
                        east: {
                            x1: column * width + width,
                            y1: row * height,
                            x2: column * width + width,
                            y2: row * height + height
                        },
                        south: {
                            x1: column * width,
                            y1: row * height + height,
                            x2: column * width + width,
                            y2: row * height + height
                        },
                        west: {
                            x1: column * width,
                            y1: row * height,
                            x2: column * width,
                            y2: row * height + height
                        }
                    };

                    this.reset = function () { };

                    this.link = function (cell, biDirectional) {
                        this.links[cell.key()] = true;
                        if (biDirectional) cell.link(this, false);
                    };

                    this.unlink = function (cell, biDirectional) {
                        delete this.links[cell.key()];
                        if (biDirectional) cell.unlink(this, false);
                    };

                    this.findNeighbors = function () {
                        /*
                                +---+---+---+
                                |   | N |   |
                                +---+---+---+
                                | W | O | E |
                                +---+---+---+
                                |   | S |   |
                                +---+---+---+
                        */

                        //will be null or a cell
                        this.neighbors.north = this.grid.cell(this.row - 1, this.column);
                        this.neighbors.east = this.grid.cell(this.row, this.column + 1);
                        this.neighbors.south = this.grid.cell(this.row + 1, this.column);
                        this.neighbors.west = this.grid.cell(this.row, this.column - 1);
                    };

                    this.carve = function (direction) {

                        let op = {
                            north: 'south',
                            east: 'west',
                            south: 'north',
                            west: 'east'
                        };

                        let d = direction.toLowerCase();
                        let o = op[d];
                        let n = this.neighbors[d];

                        if (!n) {
                            if (DEBUG.carving) {
                                $log.log('inside carve => cell(' + this.key() + ') has no ' + d + ' neighbor')
                            }
                            return false;
                        }

                        if (DEBUG.carving) {
                            $log.log('inside carve => will carve through ' + d + ' wall of cell(' + this.key() + ') into the ' + o + ' wall of cell(' + n.key() + ')')
                        }

                        n.walls[o] = false;
                        this.walls[d] = false;
                        this.link(n, true);

                        return true;
                    };

                    this.wallOff = function (direction) {

                        let op = {
                            north: 'south',
                            east: 'west',
                            south: 'north',
                            west: 'east'
                        };

                        let d = direction.toLowerCase();
                        let o = op[d];
                        let n = this.neighbors[d];

                        if (!n) {
                            if (DEBUG.carving) {
                                $log.log('inside wallOff => cell(' + this.key() + ') has no ' + d + ' neighbor')
                            }
                            return false;
                        }

                        if (DEBUG.carving) {
                            $log.log('inside carve => will carve through ' + d + ' wall of cell(' + this.key() + ') into the ' + o + ' wall of cell(' + n.key() + ')')
                        }

                        n.walls[o] = true;
                        this.walls[d] = true;
                        this.unlink(n, true);

                        return true;
                    };


                    this.draw = function (gfx) {
                        if (DEBUG.draw) {
                            let color = randomColor();
                            gfx.strokeStyle = color;
                            $log.log('inside draw => cell(' + this.key() + ')');
                            $log.log('\t\tline color: ' + color);
                            $log.log('\t\t' + JSON.stringify(this.walls));
                        }

                        for (let d in this.walls) {
                            let l = this.lines[d];
                            if (this.walls[d]) {
                                gfx.beginPath();
                                gfx.moveTo(l.x1, l.y1);
                                gfx.lineTo(l.x2, l.y2);
                                gfx.closePath();
                                gfx.stroke();
                                if (DEBUG.draw)
                                    $log.log('\t\tcell(' + this.key() + ') drew ' + d + ' wall: ' + JSON.stringify(l));
                            } else {
                                if (DEBUG.draw)
                                    $log.log('\t\tcell(' + this.key() + ') did not draw ' + d + ' wall: ' + JSON.stringify(l));
                            }
                        }
                    };
                }

            } //end Cell

            class Grid extends Array {
                constructor(rows, columns, cellWidth, cellHeight) {
                    super();

                    this.rowCount = rows;
                    this.cellCount = columns;
                    this.cellWidth = cellWidth;
                    this.cellHeight = cellHeight;
                    this.width = columns * cellWidth;
                    this.height = rows * cellHeight;
                    this.totalCellCount = this.rowCount * this.cellCount;

                    this.init = function () {
                        let first = this.length === 0;
                        for (let r = 0; r < this.rowCount; r++) {
                            for (let c = 0; c < this.cellCount; c++) {
                                if (first) {
                                    //first time we populate
                                    if (this.length === r)
                                        this.push([]);

                                    this[r].push(new Cell(this, r, c, this.cellWidth, this.cellHeight));
                                } else {
                                    //every other time we reset, data used in generation of mazes
                                    this[r][c].links = {};
                                    this[r][c].walls = {
                                        north: true,
                                        east: true,
                                        south: true,
                                        west: true
                                    };

                                    //empty method unless used by an algorithm
                                    this[r][c].reset();
                                }
                            }
                        }

                        if (first)
                            this.config();
                    };

                    this.config = function () {
                        for (let r = 0; r < this.rowCount; r++) {
                            for (let c = 0; c < this.cellCount; c++) {
                                this[r][c].findNeighbors();
                            }
                        }
                    };

                    this.cell = function (row, column) {
                        if (this[row] && this[row][column])
                            return this[row][column];

                        return null;
                    };

                    this.random = function () {
                        let r = Math.floor(Math.random() * this.rowCount);
                        let c = Math.floor(Math.random() * this.cellCount);

                        return this.cell(r, c);
                    };


                    //this method can be used to randomly redirect the flow of a run along a vector in a specific new direction
                    //currently this method creates dead ends, I plan to return and use a variant of pathfinding/backtrack to prevent that
                    this.reSample = function (vector, direction, list) {
                        let v = vector.toLowerCase();
                        let d = direction.toLowerCase();
                        let samples = Math.floor(list.length / 2);
                        let mixin = Math.floor(list.length / 4);

                        while (samples > mixin)
                            samples = Math.floor(samples / 2);

                        let lower = 0;
                        let upper = mixin;
                        for (let i = 0; i < samples; i++) {
                            let n = Math.floor(Math.random() * upper + lower);
                            if (n === list.length)
                                n--;

                            let c = list[n];
                            if (c) {
                                c.wallOff(v);
                                c.carve(d);
                            }
                            lower = upper; //move to next array segment
                            upper = upper + mixin;
                        }
                    }; //end reSample

                    this.draw = function (gfx, bg, fg) {
                        //setup canvas
                        gfx.globalAlpha = 1.0;
                        gfx.fillStyle = bg;
                        gfx.fillRect(0, 0, this.width, this.height);
                        gfx.strokeStyle = fg;
                        gfx.lineWidth = 1;

                        //draw cells
                        for (let r = 0; r < this.rowCount; r++) {
                            for (let c = 0; c < this.cellCount; c++) {
                                this[r][c].draw(gfx);
                            }
                        }

                        //outside edge
                        /*
                        gfx.lineWidth = 2;
                        gfx.beginPath();
                        gfx.moveTo(0, 0);
                        gfx.lineTo(this.width, 0);
                        gfx.lineTo(this.width, this.height);
                        gfx.lineTo(0, this.height);
                        gfx.lineTo(0, 0);
                        gfx.closePath();
                        gfx.stroke();
                        */

                    };

                }
            } //end Grid


            return new Grid(rowCount, columnCount, roomWidth, roomHeight);
        };
    });
})();