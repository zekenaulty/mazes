export class Row extends Array {

  parent = undefined;
  constructor(parent) {

    super();

    this.parent = parent;
  }

  draw(style, callback) {
    for (let i = 0; i < this.length; i++) {
      this[i].draw(style);
    }
  }

}
