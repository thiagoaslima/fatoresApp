;
(function (angular, undefined) {
    'use strict';
    angular.module('app.filters')
        .filter('duplicates', duplicates)
        .filter('removeDuplicates', ['duplicatesFilter', removeDuplicates]);

    function duplicates() {
        return function (array, getIndex) {
            var indexes = [];
            var elements = array.filter(function (el, idx) {
                if (array.indexOf(el) !== idx) {
                    indexes.push(idx);
                    return true;
                }
                return false;
            });
            return getIndex ? indexes : elements;
        };
    }

    function removeDuplicates(duplicates) {
        return function (array) {
            var idxs = duplicates(array, true).sort(function (a, b) {
                return b - a;
            });
            idxs.forEach(function (idx) {
                array.splice(idx, 1);
            });
            return array;
        };
    }
})(window.angular);