
class Grid extends Array {
    constructor(rows, columns, cellWidth, cellHeight, $log, DEBUG) {
        super();

        this.log = $log;
        this.DEBUG = DEBUG;
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

                        this[r].push(new Cell(this, r, c, this.cellWidth, this.cellHeight, this.log, this.DEBUG));
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
            gfx.lineWidth = 2;
            gfx.beginPath();
            gfx.moveTo(0, 0);
            gfx.lineTo(this.width, 0);
            gfx.lineTo(this.width, this.height);
            gfx.lineTo(0, this.height);
            gfx.lineTo(0, 0);
            gfx.closePath();
            gfx.stroke();

        };

    }
} //end Grid