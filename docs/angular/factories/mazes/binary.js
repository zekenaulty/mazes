(function () {
    "use strict";

    angular.module("mazes").factory("binary", function ($log, DEBUG) {
        return function (rows, columns, roomWidth, roomHeight) {
            return new Binary(rows, columns, roomWidth, roomHeight, $log, DEBUG);
        };
    });
})();