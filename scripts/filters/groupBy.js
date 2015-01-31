;
(function (angular, undefined) {
    'use strict';
    angular.module('app.filters')
        .filter('groupBy', groupBy)
        ;

    function groupBy() {
        return function (array, func) {
            var groups = {};
            array.forEach(function (obj) {
                var group = JSON.stringify(func(obj));
                groups[group] = groups[group] || [];
                groups[group].push(obj);
            });
            return Object.keys(groups).map(function (group) {
                return groups[group];
            });
        };
    }

})(window.angular);