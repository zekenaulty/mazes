(function () {
    "use strict";

    angular.module("mazes").factory("sidewinder", function ($log, DEBUG) {
        return function (rows, columns, roomWidth, roomHeight) {
            return new Sidewinder(rows, columns, roomWidth, roomHeight, $log, DEBUG);
        };
    });
})();