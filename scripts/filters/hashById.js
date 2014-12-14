;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.filters')
        .filter('hashById', hashById);

    function hashById() {
        return function (array) {
            var obj = {};

            array.forEach(function (item) {
                obj[item.Id] = item;
            });

            return obj;
        };
    }

})(window.angular);