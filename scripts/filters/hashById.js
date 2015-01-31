;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.filters')
        .filter('hashById', hashById)
        .filter('unhashById', unhashById);

    function hashById() {
        return function (array) {
            var obj = {};

            array.forEach(function (item) {
                obj[item.Id] = item;
            });

            return obj;
        };
    }
    
    function unhashById() {
        return function (obj) {
            if (!obj) {
                return;
            }
            
            var array = [];

            var keys = Object.keys(obj);
            keys.forEach(function (id) {
                array.push(obj[id]);
            });

            return array;
        };
    }

})(window.angular);