;
(function (angular, undefined) {
    'use strict';

    angular
        .module('app.directives')
        .directive("loader", function () {
            return {
                restrict: 'AE',
                replace: true,
                template: '<div class="spinner-container">' +
                    '<div class="spinner">' +
                    '<div class="spinner-container container1">' +
                    '<div class="circle1"></div>' +
                    '<div class="circle2"></div>' +
                    '<div class="circle3"></div>' +
                    '<div class="circle4"></div>' +
                    '</div>' +
                    '<div class="spinner-container container2">' +
                    '<div class="circle1"></div>' +
                    '<div class="circle2"></div>' +
                    '<div class="circle3"></div>' +
                    '<div class="circle4"></div>' +
                    '</div>' +
                    '<div class="spinner-container container3">' +
                    '<div class="circle1"></div>' +
                    '<div class="circle2"></div>' +
                    '<div class="circle3"></div>' +
                    '<div class="circle4"></div>' +
                    '</div></div></div>',
                link: function (scope, element) {
                    var $el = element;
                    $el.addClass('ng-hide');
                    
                    scope.$on("loader:show", function () {
                        return $el.removeClass('ng-hide');
                    });
                    scope.$on("loader:hide", function () {
                        return $el.addClass('ng-hide');
                    });
                }
            };
        });

})(window.angular);



