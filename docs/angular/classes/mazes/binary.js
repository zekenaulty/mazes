class Binary {
    constructor(rows, columns, roomWidth, roomHeight, $log, DEBUG) {

        this.grid = new Grid(rows, columns, roomWidth, roomHeight, $log, DEBUG);
        this.name = 'Binary Tree';
        this.description = `The binary tree walks each cell and choses N or E to carve into. If it can not carve in one direction it always carves in the other.`;

        this.generate = function () {

            let choice = [];
            //let east = [];
            //let north = this.grid[0];

            //begin binary tree
            for (let r = 0; r < this.grid.length; r++) {
                for (let c = 0; c < this.grid[r].length; c++) {
                    let cell = this.grid[r][c];

                    //collect the east edge so we can later sample it
                    //if (c === (columns - 1)) east.push(cell);

                    if (cell.neighbors.north) choice.push('north');
                    if (cell.neighbors.east) choice.push('east');

                    if (choice.length > 0) cell.carve(choice.sample());
                    choice = [];
                }
            } //end actual binary tree

            //once, I resolve the dead end issue, this would prevent the two major rivers
            //this.grid.reSample('east', 'south', north);
            //this.grid.reSample('south', 'west', east);

            this.start = this.grid[0][0];
            this.end = this.grid[0][columns - 1];

        };

        this.draw = function (gfx, bg, fg) {
            this.grid.draw(gfx, bg, fg);
        };
    }
}