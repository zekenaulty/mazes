export class Binary {
  name = 'Binary Tree';
  description = 'The binary tree walks each cell and choses North or East to carve into. If it can not carve in one direction it always carves in the other.';
  view = undefined;

  constructor(view) {
    this.view = view;
  }

  generate() {
    this.view.maxScale = 15;
    this.view.resize(this.view.roomCount);

    let choice = [];

    for (let r = 0; r < this.view.length; r++) {
      for (let c = 0; c < this.view[r].length; c++) {
        let cell = this.view[r][c];

        if (cell.neighbors.north) choice.push('north');
        if (cell.neighbors.east) choice.push('east');

        if (choice.length > 0) cell.connection(choice.sample(), true);
        choice = [];
      }
    }

    this.view.setup();
  }

}
