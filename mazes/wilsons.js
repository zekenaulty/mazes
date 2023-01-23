export class Wilsons {
  name = 'Wilsons (SLOW)';
  description = '';
  view = undefined;

  constructor(view) {
    this.view = view;
  }

  generate() {
    this.view.maxScale = 18;
    this.view.resize(this.view.roomCount);
    
    let unvisited = this.view.toArray();
    let first = unvisited.sample();
    unvisited.delete(first);
    while (unvisited.length > 0) {
      let cell = unvisited.sample();
      let path = new Array();
      path.push(cell);
      unvisited.forEach((c) => { c.draw(); });
      
      while (unvisited.includes(cell)) {
        cell = cell.neighbors.list.sample();
        let position = path.indexOf(cell);
        if (position >= 0) {
          path.length = position + 1;
        } else {
          path.push(cell);
        }
      }
      
      for (let i = 0; i < path.length - 1; i++) {
        let n = path[i + 1];
        let c = path[i];
        let dir = c.neighbors.directionOf(n);
        c.connection(dir, true);
        unvisited.delete(c);
      }
    }

    this.view.setup();
  }

}
