(function () {
  "use strict";

  function binaryController($scope, $element, $timeout, squareMaze) {
    var vm = squareMaze.extend(this, 576, 16); //initialize our maze

    this.$onInit = function () {};

    vm.carve = function (reset) {
      if (reset) this.maze.reset();

      /* simple maze carving */
      for (let i = 0; i < vm.maze.totalRooms; i++) {
        let d = Math.random() < 0.5 ? "east" : "north";
        let r = vm.maze.rooms[i].carve(d);
        if (!r) {
          //always carve
          vm.maze.rooms[i].carve(d === "east" ? "north" : "east");
        }
      }

      let gfx = $element[0].children[0].children[1].children[0].getContext("2d");

      vm.maze.draw(gfx, "black", "white");
    };

    vm.$postLink = function () {
      $scope.$emit("set-caption", "Binary Tree");
      $timeout(function () {
        vm.carve();
      }, 0);
    };
  }

  angular.module("mazes").component("binary", {
    controller: binaryController,
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
        This very basic maze is created by moving from cell to cell and always carving north or east. 
        We do not move the direction we carve; instead we simply walk the array. The method I use here 
        is wasteful as it keeps the full array in memory. If drawing and carving took place at the same 
        time the maze would not need to be in memory at all times.</div>
      </div>
    </div>`
  });
})();