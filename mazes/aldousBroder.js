export class AldousBroder {
  name = 'AldousBroder';
  description = '';
  view = undefined;

  constructor(view) {
    this.view = view;
  }

  generate() {
    let cell = this.view.sample().sample();
    let unvisited = this.view.roomCount - 1;
    while(unvisited > 0) {
      let neighbor = cell.neighbors.list.sample();
      if(neighbor.links.length === 0) {
        let dir = cell.neighbors.directionOf(neighbor);
        cell.connection(dir, true);
        unvisited--;
      }
      cell = neighbor;
    }
    this.view.setup();
  }

}
