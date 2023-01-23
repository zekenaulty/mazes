import { Distance, DirectionData, Line, Links, Rectangle } from '../common.js';

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
  links = new Links();

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

    let color = this.root.floorColor;
    if (this.root.active === this) {
      color = this.root.activeColor;
    } else if (this.root.end === this) {
      color = this.root.endColorOne;
    } else if (this.root.visited.includes(this)) {
      color = this.root.pathColor;
    } else if (this.root.start === this) {
      color = this.root.startColor;
    }

    let floor = new Rectangle(
      this.x,
      this.y,
      this.scale,
      this.scale,
      color,
      this.#gfx);
    floor.draw();

    if (this.walls.north) {
      this.lines.north.draw(this.root.wallColor);
    }

    if (this.walls.east) {
      this.lines.east.draw(this.root.wallColor);
    }

    if (this.walls.south) {
      this.lines.south.draw(this.root.wallColor);
    }

    if (this.walls.west) {
      this.lines.west.draw(this.root.wallColor);
    }

    if (this.root.showDistance) {
      this.#gfx.font = '1.2em monospace';
      this.#gfx.fillStyle = this.root.wallColor;
      this.#gfx.fillText(
        this.root.distances.distance(this),
        this.x + 2,
        this.y + 16,
        this.scale - 2);
    }

  }

  get key() {
    return `_${this.row}_${this.column}`;
  }

  link(cell, bi) {
    if (!cell) {
      return;
    }

    this.links.push(cell);

    if (bi) {
      cell.link(this, false);
    }
  }

  unlink() {
    if (!cell) {
      return;
    }

    this.links.remove(cell);
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

  distances() {
    let result = new Distance(this);
    let frontier = new Array();
    frontier.push(this);

    while (true) {
      let newFrontier = new Array();

      for (let i = 0; i < frontier.length; i++) {
        let cell = frontier[i];
        for (let j = 0; j < cell.links.length; j++) {
          let linked = cell.links[j];
          let d = result.distance(cell) + 1;
          if (result.includes(linked)) {
            console.log('continue');
            continue;
          }
          console.log(`${linked.key}, ${d}`);
          result.collect(linked, d);
          newFrontier.push(linked);
        }
      }

      if (newFrontier.length < 1) {
        break;
      }

      frontier = newFrontier;
    }

    console.log(result.length);
    return result;
  }
}
