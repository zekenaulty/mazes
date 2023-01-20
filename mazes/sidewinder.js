export class Sidewinder {
  name = 'Siderwinder';
  description = 'The sidewinder always carves N or E. When carving east the cell is collected into a series. When we can no longer go east or, our coin toss tells us to go north, a random cell from said series is carved north, and we reset the series.';
  view = undefined;

  constructor(view) {
    this.view = view;
  }

  generate() {


    for (let r = 0; r < this.view.length; r++) {
      let row = this.view[r];
      let run = [];
      let directions = ['north', 'east'];

      for (let c = 0; c < row.length; c++) {
        let cell = row[c];
        run.push(cell);

        let canGoEast = cell.neighbors.east !== undefined;
        let canGoNorth = cell.neighbors.north !== undefined;
        let closeRun = !canGoEast || (canGoNorth && Math.floor(Math.random() * 2) === 0);

        if (closeRun) {
          let n = run.sample();
          n.connection('north', true);
          run = [];
        } else {
          cell.connection('east', true);
        }
      }
    }

    this.view.start = this.view.sample().sample();
    this.view.end = this.view.sample().sample();
    while (this.view.start === this.view.end) {
      this.view.end = this.view.sample().sample();
    }

    this.view.active = this.view.start;

  }
}