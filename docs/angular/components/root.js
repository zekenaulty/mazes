(function () {
  "use strict";

  function rootController(
    scope,
    $element,
    $timeout,
    $log,
    ROW_COUNT,
    COLUMN_COUNT,
    CELL_WIDTH,
    CELL_HEIGHT,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    binary,
    sidewinder
  ) {
    let vm = this;




    vm.selectMaze = function (idx) {
      let maze = vm.mazes[idx];

      vm.data.selectedIndex = idx;
      vm.data.text = maze.name;
      vm.data.description = maze.description;
      maze.init();
      maze.generate();

      let gfx = $element[0].children[1].children[1].children[0].getContext("2d");
      maze.draw(gfx, "black", "white");
    };

    vm.$onInit = function () {
      //expose constant for cannvas width
      Object.defineProperty(vm, 'CANVAS_WIDTH', {
        get: function () {
          return CANVAS_WIDTH;
        },
        writable: false
      });

      //expose constant for canvas height
      Object.defineProperty(vm, 'CANVAS_HEIGHT', {
        get: function () {
          return CANVAS_WCANVAS_HEIGHTIDTH;
        },
        writable: false
      });

      vm.data = {
        text: '',
        description: ''
      };

      //load all of our mazes
      vm.mazes = [
        new binary.Maze(ROW_COUNT, COLUMN_COUNT, CELL_WIDTH, CELL_HEIGHT),
        new sidewinder.Maze(ROW_COUNT, COLUMN_COUNT, CELL_WIDTH, CELL_HEIGHT)
      ];

      //start with a random maze
      $timeout(function () {
        vm.selectMaze(Math.floor(Math.random() * vm.mazes.length))
      }, 0);
    };


  }

  angular.module("mazes").component("root", {
    bindings: {},
    controller: rootController,
    controllerAs: "vm",
    template: `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#" ui-sref="home">Maze Generation</a>
  <div>
    <span class="h5">{{vm.data.text}}</span>
  </div>
</nav>
<div>
  <div>&nbsp;</div>
  <div style="width: 100%; margin: auto; text-align: center;">
    <canvas width = "{{vm.CANVAS_WIDTH}}" height = "{{vm.CANVAS_HEIGHT}}" style = "display: inline;" / >
  </div>
  <div style="width: 100%;">
    <div style="margin: auto; width: 576px; padding: 6px 6px 6px 6px;">
      <button class="btn btn-primary" style="width: 100%" ng-click="vm.selectMaze(vm.data.selectedIndex);">Generate</button>
    </div>
    <div style="margin: auto; width: 576px; padding: 6px 6px 6px 6px;">
      <button class="btn btn-secondary  dropdown-toggle" style="width: 50%" id="available-mazes" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Mazes</button>
      <div class="dropdown-menu" aria-labelledby="available-mazes">
        <a class="dropdown-item" ng-repeat="mz in vm.mazes" href="#" ng-click="vm.selectMaze($index)" title="{{mz.description}}">{{mz.name}}</a>
      </div>
    </div>
    <div class="bg-light card" style="margin: auto; width: 576px; padding: 6px 6px 6px 6px;">{{vm.description}}</div>
  </div>
</div>
`
  });
})();