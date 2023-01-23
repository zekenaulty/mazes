export class Distance extends Array {
  root = undefined;
  distances = {};

  constructor(start) {

    super();

    this.root = start;
    this.distances[this.root.key] = 0;
    this.push(this.root)

  }

  collect(cell, distance) {
    this.distances[cell.key] = distance;
    this.push(cell);
  }

  distance(cell) {
    return this.distances[cell.key];
  }

  pathTo(cell) {
    let current = cell;
    let breadcrumbs = new Distance(this.root);
    while (current !== this.root) {
      for (let i = 0; i < current.links.length; i++) {
        let neighbor = current.links[i];
        if (this.distance(neighbor) < this.distance(current)) {
          breadcrumbs.collect(neighbor, this.distance(neighbor));
          current = neighbor;
          break;
        }
      }
    }
    return breadcrumbs;
  }

  max() {
    let maxDistance = 0;
    let maxCell = this.root;
    for (let i = 0; i < this.length; i++) {
      let c = this[i];
      let d = this.distance(c);
      if (d > maxDistance) {
        maxCell = c;
        maxDistance = d;
      }
    }

    return {
      cell: maxCell,
      distance: maxDistance
    };
  }
}

export class Links extends Array {

  constructor() {
    super();
  }

  remove(cell) {
    let idx = this.indexOf(cell);
    if (idx >= 0 && idx < this.length) {
      this.splice(idx, 1);
    }
  }
}


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

export class Rectangle {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  fillColor = 'black';
  #gfx = undefined;


  constructor(x, y, width, height, fillColor, gfx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.#gfx = gfx;
    this.fillColor = fillColor;
  }

  draw() {
    this.#gfx.fillStyle = this.fillColor;
    this.#gfx.beginPath();
    this.#gfx.rect(
      this.x,
      this.y,
      this.width,
      this.height);
    this.#gfx.fill();
    this.#gfx.closePath();
  }
}

export class DirectionData {
  north = undefined;
  east = undefined;
  south = undefined;
  west = undefined;
}

//code I plan to get back to, yes this smells bad, oh well
/*
    if (this.root.end === this) {
      let sq = 32;
      let size = this.root.cellScale(sq, this.scale, this.scale);
      let perRow = 1;
      while ((perRow + 1) * size < this.scale) {
        perRow++;
      }
      let rowCount = 1;
      while ((rowCount + 1) * size < this.scale) {
        rowCount++;
      }
      let colors = [
        this.root.endColorOne,
        this.root.endColorTwo
      ];
      let colorIdx = 0;
      for (let r = 0; r < rowCount; r++) {
        if (r % 2 === 0) {
          colorIdx = 1;
        } else {
          colorIdx = 0;
        }
        for (let c = 0; c < perRow; c++) {
          this.#gfx.fillStyle = colors[colorIdx];
          this.#gfx.beginPath();
          let x = this.x + (size * c);
          let y = this.y + (size * r);
          this.#gfx.rect(
            x,
            y,
            size,
            size);
          this.#gfx.fill();
          this.#gfx.closePath();
          if (colorIdx === 0) {
            colorIdx = 1;
          } else {
            colorIdx = 0;
          }
        }
      }
    } else {
      this.#gfx.beginPath();
      this.#gfx.rect(
        this.x,
        this.y,
        this.scale,
        this.scale);
      this.#gfx.fill();
      this.#gfx.closePath();
    }
    */
  /*
    view.addEventListener(
      'click',
      (e) => {
        const westly = view.width / 4;
        const eastly = westly * 3;
        const northly = view.height / 4;
        const southly = northly * 3;

        if (e.clientX < westly &&
          e.clientY > northly &&
          e.clientY < southly) {
          move('west');
        } else if (e.clientX > eastly &&
          e.clientY > northly &&
          e.clientY < southly) {
          move('east');
        } else if (e.clientY < northly) {
          move('north');
        } else if (e.clientY > southly) {
          move('south');
        }
      });
  */

  /*
    view.addEventListener(
      'touchstart',
      (e, n) => {
        maze.fill();
      });

    view.addEventListener(
      'touchmove',
      (e, n) => {
        let colors = [
          'red',
          'yellow',
          'orange',
          'cyan',
          'magenta'
          ];
        for (let i = 0; i < e.touches.length; i++) {
          let t = e.touches[i];
          maze.trace(t.clientX, t.clientY, colors[i]);
        }
      });

    view.addEventListener(
      'touchend',
      (e, n) => {});
    
    */
