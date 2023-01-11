import { go } from '../isReady.js';
import { Cell } from './cell.js';
import { Row } from './row.js';

export class View extends Array {

  #name = 'GridView';
  #stage = undefined;
  #canvas = undefined;
  #gfx = undefined;
  #roomCount = 0;
  #created = false;
  columns = 0;
  rows = 0;
  drawing = 0;
  
  beginDrawing(){
    this.drawing++;
  }
  
  endDrawing(){
    this.drawing--;
  }

  constructor(stage, roomCount) {

    super();

    if (!stage) {
      return;
    }

    this.#roomCount = roomCount;

    this.#stage = stage;
    this.#createCanvas();

    this.#draw();

  }

  #createCanvas() {

    this.#canvas = document.createElement('canvas');
    this.#stage.appendChild(this.#canvas);
    this.#gfx = this.#canvas.getContext("2d");

    this.#canvas.style.width = '100%';
    this.#canvas.style.height = '100%';

  }

  /*  https://math.stackexchange.com/questions/466198/algorithm-to-get-the-maximum-size-of-n-squares-that-fit-into-a-rectangle-with-a/466248#466248 */
  #cellScale = function(n, w, h)
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

  #draw() {
    if (this.#canvas) {
      if (!this.#created) {
        /* ensure we scale the frame properly */
        this.#canvas.width = this.#canvas.offsetWidth;
        this.#canvas.height = this.#canvas.offsetHeight;
        this.#populate();
        this.#created = true;
      }

      this.#fill();
      this.#drawGrid();

    }
  }

  #populate() {
    this.length = 0;

    let scale = this.#cellScale(
      this.#roomCount,
      this.#canvas.offsetWidth,
      this.#canvas.offsetHeight);

    /* Math.floor(this.#roomCount / scale); */
    let perRow = 1;
    while ((perRow + 1) * scale < this.#canvas.width) {
      perRow++;
    }
    this.columns = perRow;

    let rowCount = 1;
    while ((rowCount + 1) * scale < this.#canvas.height) {
      rowCount++;
    }
    this.rows = rowCount;

    let ox = Math.floor((this.#canvas.offsetWidth - (perRow * scale)) / 2);
    let oy = Math.floor((this.#canvas.offsetHeight - (rowCount * scale)) / 2);

    for (let r = 0; r < rowCount; r++) {
      this.push(new Row(this));
      for (let c = 0; c < perRow; c++) {
        this[r].push(new Cell(
          this,
          this[r],
          scale,
          r,
          c,
          ox,
          oy,
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
    for (let i = 0; i < this.length; i++) {
      this[i].draw('silver');
    }
  }

  #fill() {
    this.#gfx.fillStyle = 'black';
    this.#gfx.rect(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height);
    this.#gfx.fill();
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

}