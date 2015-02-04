;
(function (angular) {
    'use strict';

    angular.module('app.directives')
            .directive('sidebar', ['$rootScope', sidebar]);

    function sidebar($root) {
        return {
            restrict: 'C',
            link: function (scope, elem) {
                $root.$watch('sidebarOpen', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        return newVal ? elem.addClass('open') : elem.removeClass('open');
                    }
                });
                
                elem.on('click', function() {
                    $root.sidebarOpen = false;
                });
            }
        };
    }
})(window.angular);