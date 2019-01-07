(function () {
  "use strict";

  function rootController(
    $scope,
    $element,
    $timeout,
    $log,
    binary,
    sidewinder
  ) {
    let vm = this;


    vm.$onInit = function () {
      //current view data
      vm.data = {
        text: '',
        description: '',
        selectedSize: '3',
        selectedMaze: 0
      };

      vm.sizes = [
        { name: 'Very Very Short', rows: 6, columns: 6, width: 96, height: 96 },
        { name: 'Extra Short', rows: 8, columns: 8, width: 72, height: 72 },
        { name: 'Short', rows: 18, columns: 18, width: 32, height: 32 },
        { name: 'Medium', rows: 24, columns: 24, width: 24, height: 24 },
        { name: 'Long', rows: 32, columns: 32, width: 18, height: 18 },
        { name: 'Extra Long', rows: 72, columns: 72, width: 8, height: 8 },
        { name: 'Very Very Long', rows: 96, columns: 96, width: 6, height: 6 }
      ];

      //our square, in which we put more squares
      vm.canvasWidth = 576; vm.canvasHeight = 576;

      //all our maze generator algorithim constructors
      vm.generators = [
        binary.Maze,
        sidewinder.Maze
      ];

      vm.mazes = []; //load all of our maze generator instances in here when we change the size
      vm.initGenerators = function () {
        vm.mazes = []
        let s = vm.sizes[vm.data.selectedSize];
        for (let i = 0; i < vm.generators.length; i++) {
          vm.mazes.push(new vm.generators[i](s.rows, s.columns, s.width, s.height));
        }
      };
      vm.initGenerators();

      //alloww for multiple sizes
      vm.changeSize = function () {
        vm.initGenerators();
        vm.selectMaze(vm.data.selectedMaze);
      };

      //main worker for showing/changing mazes
      vm.selectMaze = function (idx) {
        let maze = vm.mazes[idx];

        //keep track of the selected maze
        vm.data.selectedMaze = idx;

        //setup view
        vm.data.selectedIndex = idx;
        vm.data.text = maze.name;
        vm.data.description = maze.description;

        //prep and draw maze
        maze.grid.init();
        maze.generate();
        maze.draw($element[0].children[1].children[1].children[0].getContext("2d"), "black", "white");
      };
    };

    vm.$postLink = function () {
      $timeout(function () {
        //start with a random maze, when the screen is ready
        vm.selectMaze(Math.floor(Math.random() * vm.mazes.length));
      }, 0);
    };
  }

  angular.module("mazes").component("root", {
    bindings: {},
    controller: rootController,
    controllerAs: "vm",
    template: `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark lb rounded">
  <span class="navbar-brand text-danger">Maze Generation</span>
  <button 
    class="navbar-toggler" 
    type="button" 
    data-toggle="collapse" 
    data-target="#mazes" 
    aria-controls="mazes" 
    aria-expanded="false" 
    aria-label="Toggle Mazes Menu">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse text-light" id="mazes">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <a 
          class="nav-link dropdown-toggle" 
          href="#" 
          id="mazeList" 
          role="button" 
          data-toggle="dropdown" 
          aria-haspopup="true" 
          aria-expanded="false">Mazes</a>
        <div class="dropdown-menu" aria-labelledby="mazeList">
          <a class="dropdown-item" href="javascript:void(0);" ng-repeat="m in vm.mazes" ng-click="vm.selectMaze($index)" title="{{m.description}}">{{m.name}}</a>
        </div>
      </li>
    </ul>
  </div>
  <div>
    <span class="h5 text-warning">{{vm.data.text}}</span>
  </div>
</nav>
<div>
  <div>&nbsp;</div>
  <div class="page-part">
    <canvas width="{{vm.canvasWidth}}" height="{{vm.canvasHeight}}" style="display: inline;" />
  </div>
  <div>
    <div class="bg-dark text-light card page-part pad">
    {{vm.data.description}}
    </div>
    <div class="page-part">
      <div class="space-out float-right">
        <form class="form-inline">
          <label class="text-light space-out">Maze Length/Size:</label>
          <select ng-model="vm.data.selectedSize" ng-change="vm.changeSize()" class="form-control space-out">
            <option ng-repeat="sz in vm.sizes" value="{{$index}}">{{sz.name}}</option>
          </select>
          <button class="btn btn-primary space-out" ng-click="vm.selectMaze(vm.data.selectedIndex);">Generate</button>
        </form>
      </div>
    </div>
  </div>
</div>
`
  });
})();