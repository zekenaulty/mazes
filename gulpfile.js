var gulp = require("gulp");

//define our JS resources and where we ant them to live
var destinationJS = "www/js/";
var sourceJS = [
  "node_modules/angular/angular.min.js",
  "node_modules/@uirouter/angularjs/release/angular-ui-router.min.js",
  "node_modules/jQuery/dist/jquery.min.js",
  "node_modules/bootstrap/dist/js/bootstrap.min.js"
];

//define our css resources and where we want them to live
var destinationCSS = "www/css/";
var sourceCSS = ["node_modules/bootstrap/dist/css/bootstrap.min.css"];

//sync js task
gulp.task("copy-js", function() {
  //loopy
  for (var i = 0; i < sourceJS.length; i++) {
    gulp.src(sourceJS[i]).pipe(gulp.dest(destinationJS));
  }
});

//sync css task
gulp.task("copy-css", function() {
  //loopy
  for (var i = 0; i < sourceCSS.length; i++) {
    gulp.src(sourceCSS[i]).pipe(gulp.dest(destinationCSS));
  }
});
