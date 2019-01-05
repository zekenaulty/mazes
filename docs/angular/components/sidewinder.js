(function () {
  "use strict";

  function sidewinderController($scope, $element, $timeout, $log, sidewinder) {
    var vm = this; //initialize our maze

    this.$onInit = function () {
      vm.maze = new sidewinder.Maze(36, 36, 16, 16);
    };

    vm.carve = function (reset) {
      if (reset) {
        vm.maze.maze.init();
        vm.maze.maze.config();
      }

      vm.maze.generate();

      let gfx = $element[0].children[0].children[1].children[0].getContext("2d");

      vm.maze.draw(gfx, "black", "white");
    };

    vm.$postLink = function () {
      $scope.$emit("set-caption", "Sidewinder");
      $timeout(function () {
        vm.carve();
      }, 0);
    };
  }

  angular.module("mazes").component("sidewinder", {
    controller: sidewinderController,
    controllerAs: "vm",
    template: `
    <div>
      <div>&nbsp;</div>
      <div style="width: 100%; margin: auto; text-align: center;">
        <canvas width="576" height="576" style="display: inline;" />
      </div>
      <div style="width: 100%;">
        <div style="margin: auto; width: 576px; padding: 6px 6px 6px 6px;">
          <button class="btn btn-primary" style="width: 100%" ng-click="vm.carve(true);">Generate</button>
        </div>
        <div class="bg-light card" style="margin: auto; width: 576px; padding: 6px 6px 6px 6px;">
        This maze is slightly more complex than the binary tree maze. However this maze still uses a single bit
        to determine it actions while always moving west to east. When false it carves east and when true it carves
        north from a random cell in the previous series of cells that it carved east. When it carves north it moves east
        but does not carve.
        </div>
      </div>
    </div>`
  });
})();