(function() {
  "use strict";

  function rootController($state) {
    let vm = this;
    vm.mazes = [{ caption: "Binary", state: "binary" }];
  }

  angular.module("mazes").component("root", {
    bindings: {},
    controller: rootController,
    controllerAs: "vm",
    template: `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#" ui-sref="home">Maze Generation</a>
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
  <div class="collapse navbar-collapse" id="mazes">
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
          <a class="dropdown-item" href="#" ng-repeat="m in vm.mazes" ui-sref="{{m.state}}">{{m.caption}}</a>
        </div>
      </li>
    </ul>
  </div>
</nav>
<div>
    <div class="row">
      <div class="col-md-12">
        <ui-view></ui-view>
      </div>
    </div>
</div>
        `
  });
})();
