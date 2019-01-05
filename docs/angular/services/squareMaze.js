(function () {
  "use strict";
  //this was the first maze class/service, but it is not flexiable enough, and I went to a "traditional" grid
  angular.module("mazes").service("squareMaze", function () {
    this.extend = function (target, mazeSize, cellSize) {
      //constructor function for a maze
      function Maze(mSize, cSize) {
        //constructor function for a room/cell
        function Cell(rooms, row, column, size, space, index) {
          this.rooms = rooms;
          this.walls = {
            north: true,
            east: true,
            south: true,
            west: true
          };

          this.index = index;
          this.size = size;
          this.space = space;
          this.x = size * column;
          this.y = size * row;
          this.row = row;
          this.column = column;
          //this.visited = false;
          this.cellsX = Math.floor(space / size);

          this.getIndex = function (row, column) {
            return row * this.cellsX + column;
          };

          this.northNeighbor = function () {
            if (this.row === 0) return null;
            let idx = this.getIndex(this.row - 1, this.column);
            let r = this.rooms[idx];
            return r;
          };

          this.eastNeighbor = function () {
            if (this.column > this.cellsX - 2) return null;
            let idx = this.getIndex(this.row, this.column + 1);
            let r = this.rooms[idx];
            return r;
          };

          this.southNeighbor = function () {
            if (this.row > this.cellsX - 2) return null;
            let idx = this.getIndex(this.row + 1, this.column);
            let r = this.rooms[idx];
            return r;
          };

          this.westNeighbor = function () {
            if (this.column === 0) return null;
            let idx = this.getIndex(this.row, this.column - 1);
            let r = this.rooms[idx];
            return r;
          };

          this.carve = function (direction) {
            //this.visited = true;
            let d = direction.toLowerCase();
            switch (d) {
              case "north":
                let n = this.northNeighbor();
                if (n !== null) {
                  this.walls.north = false;
                  n.walls.south = false;
                  return true;
                }
                return false;
              case "east":
                let e = this.eastNeighbor();
                if (e !== null) {
                  this.walls.east = false;
                  e.walls.west = false;
                  return true;
                }
                return false;
              case "south":
                let s = this.southNeighbor();
                if (s !== null) {
                  this.walls.south = false;
                  s.walls.north = false;
                  return true;
                }
                return false;
              case "west":
                let w = this.westNeighbor();
                if (w !== null) {
                  this.walls.west = false;
                  w.walls.east = false;
                  return true;
                }
                return false;
            }
          };

          this.draw = function (gfx) {
            //north wall?
            if (this.walls.north) {
              gfx.beginPath();
              gfx.moveTo(this.x, this.y);
              gfx.lineTo(this.size + this.x, this.y);
              gfx.closePath();
              gfx.stroke();
            }
            //east wall?
            if (this.walls.east) {
              gfx.beginPath();
              gfx.moveTo(this.size + this.x, this.y);
              gfx.lineTo(this.size + this.x, this.y + this.size);
              gfx.closePath();
              gfx.stroke();
            }
            //south wall?
            if (this.walls.south) {
              gfx.beginPath();
              gfx.moveTo(this.x, this.size + this.y);
              gfx.lineTo(this.x + this.size, this.size + this.y);
              gfx.closePath();
              gfx.stroke();
            }
            //west wall?
            if (this.walls.west) {
              gfx.beginPath();
              gfx.moveTo(this.x, this.y + this.size);
              gfx.lineTo(this.x, this.y);
              gfx.closePath();
              gfx.stroke();
            }
          };
        } //end Cell

        this.width = mSize;
        this.height = mSize;

        this.rows = Math.floor(mSize / cSize);
        this.columns = this.rows;
        this.totalRooms = this.rows * this.columns;
        this.rooms = [];

        this.draw = function (gfx, bg, fg) {
          gfx.globalAlpha = 1.0;
          gfx.fillStyle = bg;
          gfx.clearRect(0, 0, this.width, this.height);
          gfx.fillRect(0, 0, this.width, this.height);
          gfx.strokeStyle = fg;
          gfx.lineWidth = 1;

          //draw all our rooms
          for (let i = 0; i < this.totalRooms; i++) {
            this.rooms[i].draw(gfx);
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

        for (let i = 0; i < this.totalRooms; i++) {
          this.rooms.push(
            new Cell(
              this.rooms,
              Math.floor(i / this.columns),
              Math.floor(i % this.columns),
              cSize,
              mSize,
              i
            )
          );
        }

        this.reset = function () {
          for (let i = 0; i < this.rooms.length; i++) {
            this.rooms[i].walls = {
              north: true,
              east: true,
              south: true,
              west: true
            };
          }
        };
      } //end Maze

      target.maze = new Maze(mazeSize, cellSize);

      return target;
    };
  });
})();