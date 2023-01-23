import { go } from '../isReady.js';
import { Cell } from './cell.js';
import { Row } from './row.js';
import { Distance, DirectionData, Line, Links, Rectangle } from '../common.js';

export class View extends Array {

  #name = 'GridView';
  #stage = undefined;
  #canvas = undefined;
  #gfx = undefined;
  roomCount = 0;
  #created = false;
  columns = 0;
  rows = 0;
  drawing = 0;
  width = 0;
  height = 0;
  ox = 0;
  oy = 0;
  start = undefined;
  end = undefined;
  endDistance = 0;
  active = undefined;
  visited = [];
  moves = 0;
  wallColor = 'orange';
  floorColor = 'black';
  startColor = 'white';
  endColorOne = 'green';
  endColorTwo = 'white';
  pathColor = 'white';
  activeColor = 'red';
  solveColor = 'cornflowerblue';
  showDistance = false;
  distances = undefined;
  solution = undefined;

  constructor(stage, roomCount) {

    super();

    if (!stage) {
      return;
    }

    this.roomCount = roomCount;
    this.#stage = stage;
    this.#createCanvas();
    this.#init();

  }

  resize(roomCount) {
    this.roomCount = roomCount;
    this.length = 0;
    this.#populate();
    this.#init();
    this.#fill();
  }

  #createCanvas() {

    this.#canvas = document.createElement('canvas');
    this.#stage.appendChild(this.#canvas);
    this.#gfx = this.#canvas.getContext("2d");

    this.#canvas.style.width = '100%';
    this.#canvas.style.height = '100%';

  }

  /*  https://math.stackexchange.com/questions/466198/algorithm-to-get-the-maximum-size-of-n-squares-that-fit-into-a-rectangle-with-a/466248#466248 */
  cellScale = function(n, w, h)
  {

    let sw, sh;
    let pw = Math.ceil(Math.sqrt(n * w / h));
    if (Math.floor(pw * h / w) * pw < n) {
      sw = h / Math.ceil(pw * h / w);
    } else {
      sw = w / pw;
    }
    let ph = Math.ceil(Math.sqrt(n * h / w));
    if (Math.floor(ph * w / h) * ph < n) {
      sh = w / Math.ceil(w * ph / h);
    } else {
      sh = h / ph;
    }
    return Math.floor(Math.max(sw, sh));
  }

  #init() {
    if (this.#canvas) {
      if (!this.#created) {
        /* ensure we scale the frame properly */
        this.#canvas.width = this.#canvas.offsetWidth;
        this.#canvas.height = this.#canvas.offsetHeight;
        this.#populate();
        this.#created = true;
      }
    }
  }

  #populate() {
    for (let n = 0; n < this.length; n++) {
      this[n].length = 0;
    }
    this.length = 0;
    this.visited.length = 0;
    this.moves = 0;

    let scale = this.cellScale(
      this.roomCount,
      this.#canvas.offsetWidth,
      this.#canvas.offsetHeight);

    /* Math.floor(this.roomCount / scale); */
    let perRow = 1;
    while ((perRow + 1) * scale < this.#canvas.width) {
      perRow++;
    }
    this.columns = perRow;
    this.width = this.columns * scale;

    let rowCount = 1;
    while ((rowCount + 1) * scale < this.#canvas.height) {
      rowCount++;
    }
    this.rows = rowCount;
    this.height = this.rows * scale;

    this.roomCount = perRow * rowCount;

    this.ox = Math.floor((this.#canvas.offsetWidth - (perRow * scale)) / 2);
    this.oy = Math.floor((this.#canvas.offsetHeight - (rowCount * scale)) / 2);

    for (let r = 0; r < rowCount; r++) {
      this.push(new Row(this));
      for (let c = 0; c < perRow; c++) {
        this[r].push(new Cell(
          this,
          this[r],
          scale,
          r,
          c,
          this.ox,
          this.oy,
          this.#gfx));
      }
    }

    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < perRow; c++) {
        this[r][c].findNeighbors();
      }
    }
  }

  cell(row, column) {
    if (row < 0 || column < 0) {
      return undefined;
    }

    if (row >= this.length) {
      return undefined;
    }

    if (column >= this[row].length) {
      return undefined;
    }

    return this[row][column];
  }

  #drawGrid() {
    this.#gfx.lineWidth = 1;
    this.#fill();
    for (let i = 0; i < this.length; i++) {
      this[i].draw();
    }
  }

  fill() {
    this.#fill();
  }

  #fill() {
    this.#gfx.beginPath();
    this.#gfx.fillStyle = this.floorColor;
    this.#gfx.strokeStyle = this.floorColor;
    this.#gfx.rect(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height);
    this.#gfx.fill();
    this.#gfx.stroke();
    this.#gfx.closePath();
  }

  draw() {
    this.#fill();
    this.#drawGrid();
  }

  seal() {
    for (let r = 0; r < this.length; r++) {
      for (let c = 0; c < this[r].length; c++) {
        this[r][c].walls.north = true;
        this[r][c].walls.east = true;
        this[r][c].walls.south = true;
        this[r][c].walls.west = true;
        this[r][c].links = {};
      }
    }
  }

  move(dir) {
    if (!this.active.walls[dir]) {
      this.moves++;
      let last = this.active;
      if (!this.visited.includes(last)) {
        this.visited.push(last);
      }
      this.active = this.active.neighbors[dir];
      last.draw();
      this.active.draw();
    }
  }

  trace(x, y, c) {
    this.#gfx.beginPath();
    this.#gfx.fillStyle = c;
    this.#gfx.strokeStyle = c;
    this.#gfx.rect(
      x,
      y,
      3,
      3);
    this.#gfx.fill();
    this.#gfx.stroke();
    this.#gfx.closePath();
  }

  solve() {
    //this.distances = this.start.distances();
    this.solution = this.distances.pathTo(this.end);
    let t = 25;
    for (let j = this.solution.length - 1; j > -1; j--) {
      setTimeout(() => { this.solution[j].draw(); }, t);
      t += 25;
    }
  }
  
  setup() {
    
    this.start = this.sample().sample();
    this.distances = this.start.distances();
    let d = this.distances.max();
    this.end = d.cell;
    this.endDistance = d.distance;
    this.active = this.start;
    
  }
}
