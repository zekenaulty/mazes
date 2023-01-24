export class RecursiveBacktracker {
  name = 'Recursive Backtracker';
  description = '';
  view = undefined;

  constructor(view) {
    this.view = view;
  }

  generate() {
    this.view.maxScale = 5;
    this.view.resize(this.view.roomCount);

    let stack = new Array();
    stack.push(this.view.sample().sample());
    
    while(stack.length > 0) {
      let current = stack[stack.length - 1];
      let neighbors = current.neighbors.list.filter(e => e.links.length === 0);
      
      if(neighbors.length === 0) {
        stack.pop();
      } else {
        let neighbor = neighbors.sample();
        let dir = current.neighbors.directionOf(neighbor);
        current.connection(dir, true);
        stack.push(neighbor);
      }
    }

    this.view.setup();
  }

}
