(function() {
  "use strict";

  function homeController($scope) {
    let vm = this;

    $scope.$emit("set-caption", "");
  }

  angular.module("mazes").component("home", {
    bindings: {},
    controller: homeController,
    controllerAs: "vm",
    template: `
<div>&nbsp;</div>
<div class="bg-light col-md-12 card">
    <div>&nbsp;</div>
    <h4>Mazes</h4>
    <span>
    I've decided to finally follow through on learning to generate mazes. It has always been something I was interested in, but never had the chance to work on. Being a self taught developer/programmer algorithms have always been my weakest area and I hope building this site has lessened that to some degree.
    </span>
    <div>&nbsp;</div>
</div>
`
  });
})();
