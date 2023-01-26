export class HuntAndKill {
  name = 'Hunt and Kill';
  description = '';
  view = undefined;

  constructor(view) {
    this.view = view;
  }

  generate() {
    this.view.maxScale = 15;
    this.view.resize(this.view.roomCount);

    let current = this.view.sample().sample();
    let cells = this.view.toArray();

    while (current) {
      let unvisitedNeighbors = current.neighbors.list.filter(e => e.links.length === 0);
      if (unvisitedNeighbors.length > 0) {
        let neighbor = unvisitedNeighbors.sample();
        let dir = current.neighbors.directionOf(neighbor);
        current.connection(dir, true);
        current = neighbor;
      } else {
        current = undefined;
        for (let idx = 0; idx < cells.length; idx++) {
          let cell = cells[idx];
          let visitedNeighbors = cell.neighbors.list.filter(e => e.links.length > 0);
          if (cell.links.length === 0 && visitedNeighbors.length > 0) {
            current = cell;
            let neighbor = visitedNeighbors.sample();
            let dir = current.neighbors.directionOf(neighbor);
            current.connection(dir, true);
            break;
          }
        }
      }
    }

    this.view.setup();
  }

}
