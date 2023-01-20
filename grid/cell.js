export class Line {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  #gfx = undefined;

  constructor(x1, y1, x2, y2, gfx) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.#gfx = gfx;
  }

  draw(style) {
    let exec = () => {


      this.#gfx.beginPath();
      this.#gfx.moveTo(this.x1, this.y1);
      this.#gfx.lineTo(this.x2, this.y2);
      this.#gfx.closePath();
      this.#gfx.strokeStyle = style;
      this.#gfx.stroke();
      this.#gfx.closePath();
    };

    //setTimeout(() => { exec(); }, 10);
    exec();
  }
}

export class DirectionData {
  north = undefined;
  east = undefined;
  south = undefined;
  west = undefined;
}

export class Cell extends Array {

  #name = 'Cell';

  view = undefined;
  parent = undefined;
  x = 0;
  y = 0;
  scale = 0;
  row = 0;
  column = 0;
  #gfx = undefined;
  walls = new DirectionData();
  neighbors = new DirectionData();
  lines = new DirectionData();
  ox = 0;
  oy = 0;
  links = {};

  constructor(
    root,
    parent,
    scale,
    row,
    column,
    ox,
    oy,
    gfx) {

    super();

    if (!parent || !root) {
      return;
    }

    this.root = root;
    this.parent = parent;
    this.scale = scale;
    this.row = row;
    this.column = column;
    this.#gfx = gfx;
    this.x = column * scale + ox;
    this.y = row * scale + oy;
    this.ox = ox;
    this.oy = oy;

    this.walls.north = true;
    this.walls.east = true;
    this.walls.south = true;
    this.walls.west = true;

    this.lines.north = new Line(
      this.x,
      this.y,
      this.x + scale,
      this.y,
      this.#gfx);

    this.lines.east = new Line(
      this.x + scale,
      this.y,
      this.x + scale,
      this.y + scale,
      this.#gfx);

    this.lines.south = new Line(
      this.x,
      this.y + scale,
      this.x + scale,
      this.y + scale,
      this.#gfx);

    this.lines.west = new Line(
      this.x,
      this.y,
      this.x,
      this.y + scale,
      this.#gfx);
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

    /* will be undefined or a cell */
    this.neighbors.north = this.root.cell(this.row - 1, this.column);
    this.neighbors.east = this.root.cell(this.row, this.column + 1);
    this.neighbors.south = this.root.cell(this.row + 1, this.column);
    this.neighbors.west = this.root.cell(this.row, this.column - 1);
  }

  draw(style) {

    if (this.root.start === this) {
      this.#gfx.fillStyle = 'blue';
    } else if (this.root.end === this) {
      this.#gfx.fillStyle = 'green';
    } else {
      this.#gfx.fillStyle = 'black';
    }

    this.#gfx.beginPath();
    this.#gfx.rect(
      this.x,
      this.y,
      this.scale,
      this.scale);
    this.#gfx.fill();
    this.#gfx.closePath();

    if (this.root.active === this) {
      this.#gfx.beginPath();
      this.#gfx.fillStyle = 'red';
      this.#gfx.rect(
        this.x,
        this.y,
        this.scale,
        this.scale);
      this.#gfx.fill();
      this.#gfx.closePath();
    }

    if (this.walls.north) {
      this.lines.north.draw(style);
    }

    if (this.walls.east) {
      this.lines.east.draw(style);
    }

    if (this.walls.south) {
      this.lines.south.draw(style);
    }

    if (this.walls.west) {
      this.lines.west.draw(style);
    }

  }

  get key() {
    return `_${this.row}_${this.column}`;
  }

  link(cell, bi) {
    if (!cell) {
      return;
    }

    this.links[cell.key] = true;

    if (bi) {
      cell.link(this, false);
    }
  }

  unlink() {
    if (!cell) {
      return;
    }

    delete this.links[cell.key];
    if (bi) {
      cell.unlink(this, false);
    }
  }

  connection(dir, open) {

    if (!dir) {
      return false;
    }

    const op = {
      north: 'south',
      east: 'west',
      south: 'north',
      west: 'east'
    };

    const d = dir.toLowerCase();
    const o = op[d];
    const n = this.neighbors[d];

    if (!n) {
      return false;
    }

    n.walls[o] = !open;
    this.walls[d] = !open;

    if (open) {
      this.link(n, true);
    } else {
      this.unlink(n, true);
    }

    return true;
  }


}
