;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.directives')
        .directive('formReset', formReset);

    function formReset() {
        return {
            restrict: 'A',
            link: linker
        };

        function linker(scope, elem) {
            console.log(elem, elem.find('input'));
            scope.$on('form:reset', function () {
                elem.find('input').removeClass('ng-touched').removeClass('ng-dirty');
                console.log(elem, elem.find('input'));
            });
        }
    }




})(window.angular);


