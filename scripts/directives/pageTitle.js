// Pressupõe o uso do módulo ui.router
;
(function (angular) {
    'use strict';

    angular
        .module('app.directives')
        .directive('pageTitle', ['$compile', pageTitle]);

    function pageTitle($compile) {
        return {
            restrict: 'AE',
            replace: true,
            compile: compiler,
            controller: controller
        };
    }

    function compiler(element, attrs) {
        var $el = (attrs.tag) ? angular.element('<' + attrs.tag + '>') : angular.element('<h2>');
        $el.html('{{page.title}}');
        element.append($el);
    }
    
    controller.$inject = ['$scope', 'appInfo'];
    function controller(scope, appInfo) {
        var listener = function (event, toState) {
            scope.page = scope.page || {};
            scope.page.title = (toState && toState.data && toState.data.pageTitle)
                ? toState.data.pageTitle
                : appInfo.appTitle;
        };
        listener();
        scope.$on('$stateChangeSuccess', listener);
    }
}(window.angular));