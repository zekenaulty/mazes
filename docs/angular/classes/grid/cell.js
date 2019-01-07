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

class Cell {
    constructor(grid, row, column, width, height, $log, DEBUG) {

        this.log = $log;
        this.DEBUG = DEBUG;
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
                if (this.DEBUG.carving) {
                    this.log.log('inside carve => cell(' + this.key() + ') has no ' + d + ' neighbor')
                }
                return false;
            }

            if (this.DEBUG.carving) {
                this.log.log('inside carve => will carve through ' + d + ' wall of cell(' + this.key() + ') into the ' + o + ' wall of cell(' + n.key() + ')')
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
                if (this.DEBUG.carving) {
                    this.log.log('inside wallOff => cell(' + this.key() + ') has no ' + d + ' neighbor')
                }
                return false;
            }

            if (this.DEBUG.carving) {
                this.log.log('inside carve => will carve through ' + d + ' wall of cell(' + this.key() + ') into the ' + o + ' wall of cell(' + n.key() + ')')
            }

            n.walls[o] = true;
            this.walls[d] = true;
            this.unlink(n, true);

            return true;
        };


        this.draw = function (gfx) {
            if (this.DEBUG.draw) {
                let color = randomColor();
                gfx.strokeStyle = color;
                this.log.log('inside draw => cell(' + this.key() + ')');
                this.log.log('\t\tline color: ' + color);
                this.log.log('\t\t' + JSON.stringify(this.walls));
            }

            for (let d in this.walls) {
                let l = this.lines[d];
                if (this.walls[d]) {
                    gfx.beginPath();
                    gfx.moveTo(l.x1, l.y1);
                    gfx.lineTo(l.x2, l.y2);
                    gfx.closePath();
                    gfx.stroke();
                    if (this.DEBUG.draw)
                        this.log.log('\t\tcell(' + this.key() + ') drew ' + d + ' wall: ' + JSON.stringify(l));
                } else {
                    if (this.DEBUG.draw)
                        this.log.log('\t\tcell(' + this.key() + ') did not draw ' + d + ' wall: ' + JSON.stringify(l));
                }
            }
        };
    }

} //end Cell