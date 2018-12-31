(function() {
  "use strict";

  function sidewinderController($scope, $element, $timeout, $log, squareMaze) {
    var vm = squareMaze.extend(this, 576, 16); //initialize our maze

    this.$onInit = function() {};

    vm.carve = function(reset) {
      if (reset) this.maze.reset();

      let cellCount = Math.floor(576 / 16);
      let sw = (cellCount - 1) * cellCount; // southwest corner (0, 35)
      let room = this.maze.rooms[sw];
      let visited = 0;
      let run = [room];
      let bit = Math.random() > 0.5 ? true : false;
      let nextRoom = null;

      run.push(room); //add the first room

      while (visited < this.maze.totalRooms) {
        if (bit) {
          if (run.length > 0) {
            let n = room.northNeighbor();
            if (n) {
              let runRoom = run[0];

              if (run.length > 1)
                runRoom = run[Math.floor(Math.random() * run.length)];

              runRoom.carve("north");
            } else {
              room.carve("east");
            }
            run = [];
          }
        } else {
          room.carve("east");
        }

        nextRoom = room.eastNeighbor();
        if (nextRoom === null) {
          if (run.length > 0) {
            let n = room.northNeighbor();
            if (n) {
              let runRoom = run[0];

              if (run.length > 1)
                runRoom = run[Math.floor(Math.random() * run.length)];

              runRoom.carve("north");
            } else {
              break; //end
            }
            run = [];
          }
          nextRoom = this.maze.rooms[(room.row - 1) * cellCount];
        }

        bit = Math.random() > 0.5 ? true : false;
        room = nextRoom;
        run.push(room);
        visited++;
      }

      let gfx = $element[0].children[0].children[1].children[0].getContext(
        "2d"
      );

      vm.maze.draw(gfx, "black", "white");
    };

    vm.$postLink = function() {
      $scope.$emit("set-caption", "Sidewinder");
      $timeout(function() {
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
