(function() {
  "use strict";
  angular
    .module("mazes")
    .config(function(
      $stateProvider,
      $urlMatcherFactoryProvider,
      $urlRouterProvider,
      $locationProvider,
      $urlServiceProvider
    ) {
      $urlRouterProvider.otherwise("/home");

      $stateProvider
        .state("home", {
          url: "/home",
          component: "home"
        })
        .state("binary", {
          url: "/binary",
          component: "binary"
        });
    });
})();
