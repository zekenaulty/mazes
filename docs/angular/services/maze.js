(function () {
    "use strict";

    angular.module("mazes").service("maze", function () {
        this.new = function (rowCount, columnCount, roomWidth, roomHeight, ) {

            class Cell {
                constructor(grid, row, column, width, height) {
                    //I should do this properly later with get/set, but with no read only we should be fine
                    this.grid = grid;
                    this.row = row;
                    this.column = column;
                    this.width = width;
                    this.height = height;
                    this.x = row * width;
                    this.y = column * height;
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
                }

                key() {
                    return this.row + ',' + this.column;
                }

                link(cell, biDirectional) {
                    this.links[cell.key()] = true;
                    if (biDirectional) cell.link(this, false);
                }

                unlink(cell, biDirectional) {
                    delete this.links[cell.key()];
                    if (biDirectional) cell.unlink(this, false);
                }

                findNeighbors() {
                    /*
                            +---+---+---+
                            |   | N |   |
                            +---+---+---+
                            | W | O | E |
                            +---+---+---+
                            |   | S |   |
                            +---+---+---+
                    */

                    //north? row - 1, c
                    if (this.row > 0)
                        this.neighbors.north = this.cell(this.row - 1, this.column);
                    else
                        this.neighbors.north = null;

                    //east?
                    if (this.column < this[this.row].length - 1)
                        this.neighbors.east = this.cell(this.row, this.column - 1);
                    else
                        this.neighbors.east = null;

                    //south?
                    if (this.row < this.length - 1)
                        this.neighbors.south = this.cell(this.row + 1, this.column);
                    else
                        this.neighbors.south = null;

                    //west?
                    if (this.column > 0)
                        this.neighbors.west = this.cell(this.row, this.column - 1);
                    else
                        this.neighbors.west = null;
                }

                carve(direction) {

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
                }

                draw(gfx) {
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
                }
            } //end Cell

            class Grid extends Array {
                constructor(rows, columns, cellWidth, cellHeight) {
                    this.rowCount = rows;
                    this.cellCount = columns;
                    this.cellWidth = cellWidth;
                    this.cellHeight = cellHeight;
                    this.width = rows * cellWidth;
                    this.height = columns * cellHeight;
                    this.cellCount = this.rowCount * this.cellCount;
                    init();
                }

                init() {
                    for (let r = 0; r < this.rowCount; r++) {
                        for (let c = 0; c < this.cellCount; c++) {
                            if (this.length === r) {
                                let row = [];
                                row.cells = function* () {
                                    for (let idx = 0; idx < this.length; idx++)
                                        yield this[idx];
                                };
                                this.push(row);
                            }

                            this[r].push(new Cell(this, r, c, this.cellWidth, this.cellHeight));
                        }
                    }
                    this.config();
                }

                config() {
                    const iCells = this.cells();
                    for (let cell of iCells)
                        cell.findNeighbors();
                }

                cell(row, column) {
                    if (row >= this.length)
                        return null;

                    if (column >= this[row].length)
                        return null;

                    return this[row][column];
                }

                * rows() {
                    for (let r = 0; r < this.length; r++)
                        yield this[r];
                }

                * cells() {
                    for (let r = 0; r < this.length; r++) {
                        for (let c = 0; c < this[r].length; c++) {
                            yield this.cell(r, c);
                        }
                    }
                }

                random() {
                    let r = Math.floor(Math.random() * this.length);
                    let c = Math.floor(Math.random() * this[r].length);

                    return this.cell(r, c);
                }

                draw(gfx, bg, fg) {
                    //setup canvas
                    gfx.globalAlpha = 1.0;
                    gfx.fillStyle = bg;
                    gfx.clearRect(0, 0, this.width, this.height);
                    gfx.fillRect(0, 0, this.width, this.height);
                    gfx.strokeStyle = fg;
                    gfx.lineWidth = 1;

                    //draw cells
                    const iCells = this.cells();
                    for (let cell of iCells) {
                        cell.draw(gfx);
                    }

                    //outside edge
                    gfx.lineWidth = 2;
                    gfx.beginPath();
                    gfx.moveTo(0, 0);
                    gfx.lineTo(this.width, 0);
                    gfx.lineTo(this.width, this.height);
                    gfx.lineTo(0, this.height);
                    gfx.lineTo(0, 0);
                    gfx.closePath();
                    gfx.stroke();

                }

            } //end Grid


            return new Grid(rowCount, columnCount, roomWidth, roomHeight);
        };
    });
})();